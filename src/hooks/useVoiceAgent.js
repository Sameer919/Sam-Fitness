import { useState, useEffect, useRef, useCallback } from 'react'

export default function useVoiceAgent({ onSpeechRecognized, onSpeechError } = {}) {
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    return !!SpeechRecognition
  })
  
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('ai_assistant_muted') === 'true'
  })
  const [browserWarning, setBrowserWarning] = useState('')

  const recognitionRef = useRef(null)
  const activeUtteranceRef = useRef(null)
  
  // Track continuous conversation mode
  const isContinuousRef = useRef(false)

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      // Wrap in setTimeout to avoid synchronous state update in render cycle
      setTimeout(() => {
        setBrowserWarning('Web Speech Recognition is not supported in this browser. Please try Chrome, Edge, or Safari.')
      }, 0)
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = false // Turn-by-turn is more robust for message processing
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onstart = () => {
      setIsListening(true)
    }

    rec.onend = () => {
      setIsListening(false)
      // If we are in continuous mode and the AI is NOT speaking, restart listening
      if (isContinuousRef.current && !window.speechSynthesis.speaking && !isSpeaking) {
        try {
          rec.start()
        } catch (err) {
          console.warn('[VOICE AGENT] Speech recognition auto-restart skipped:', err.message)
        }
      }
    }

    rec.onresult = (event) => {
      const resultText = event.results[0][0].transcript
      console.log('[VOICE AGENT] Speech recognized:', resultText)
      
      // Voice Interruption: If AI is speaking, cancel TTS immediately when user speaks
      if (window.speechSynthesis.speaking) {
        console.log('[VOICE AGENT] Interrupted AI speech!')
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      }

      if (onSpeechRecognized) {
        onSpeechRecognized(resultText)
      }
    }

    rec.onerror = (event) => {
      console.error('[VOICE AGENT] Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setBrowserWarning('Microphone access denied. Please grant mic permissions to use the voice agent.')
      }
      setIsListening(false)
      if (onSpeechError) {
        onSpeechError(event.error)
      }
    }

    recognitionRef.current = rec

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (err) {
          console.warn('[VOICE AGENT] Recognition abort on cleanup failed:', err.message)
        }
      }
      window.speechSynthesis.cancel()
    }
  }, [onSpeechRecognized, onSpeechError, isSpeaking])

  // Sync mute state with localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('ai_assistant_muted', isMuted ? 'true' : 'false')
  }, [isMuted])

  // Speak text via SpeechSynthesis
  const speak = useCallback((text) => {
    if (!text || typeof window === 'undefined') return
    if (isMuted) {
      console.log('[VOICE AGENT] Speak called, but agent is muted.')
      return
    }

    // Cancel current speaking
    window.speechSynthesis.cancel()

    // Clean text of markdown characters for cleaner speaking
    const cleanText = text
      .replace(/[*#`_\->[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    activeUtteranceRef.current = utterance

    // Get premium voices
    const voices = window.speechSynthesis.getVoices()
    // Prefer Google/Microsoft English female voices for friendly concierge tone
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'))

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.rate = 1.05 // Slightly faster for natural conversational flow
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      // Temporarily pause speech recognition while AI talks to prevent feedback loop
      if (isListening && recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      // If in continuous mode, resume listening after AI finishes speaking
      if (isContinuousRef.current && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start()
          } catch (err) {
            console.warn('[VOICE AGENT] Speech recognition start in onend failed:', err.message)
          }
        }, 150)
      }
    }

    utterance.onerror = (e) => {
      console.error('[VOICE AGENT] Speech synthesis error:', e)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [isMuted, isListening])

  const stopSpeaking = useCallback(() => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const startListening = useCallback((continuous = false) => {
    if (!isSupported || !recognitionRef.current) return
    
    isContinuousRef.current = continuous
    stopSpeaking()

    try {
      recognitionRef.current.start()
    } catch (err) {
      console.warn('[VOICE AGENT] Recognition start failed:', err.message)
      // If already started, force restart
      try {
        recognitionRef.current.stop()
        setTimeout(() => {
          try {
            recognitionRef.current.start()
          } catch (e) {
            console.warn('[VOICE AGENT] Recognition start retry failed:', e.message)
          }
        }, 100)
      } catch (retryErr) {
        console.warn('[VOICE AGENT] Recognition stop and retry chain failed:', retryErr.message)
      }
    }
  }, [isSupported, stopSpeaking])

  const stopListening = useCallback(() => {
    isContinuousRef.current = false
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.warn('[VOICE AGENT] Stop listening failed:', err.message)
      }
    }
    setIsListening(false)
  }, [])

  const toggleMute = useCallback(() => {
    if (typeof window === 'undefined') return
    setIsMuted(prev => {
      const next = !prev
      if (next) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      }
      return next
    })
  }, [])

  return {
    isSupported,
    isListening,
    isSpeaking,
    isMuted,
    browserWarning,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleMute
  }
}
