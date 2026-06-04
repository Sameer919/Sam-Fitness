import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  RiRobot2Line, RiSendPlane2Line, RiDeleteBinLine, RiCloseLine, 
  RiMicLine, RiVolumeUpLine, RiVolumeMuteLine, 
  RiAlertLine, RiRefreshLine, RiSparklingLine
} from 'react-icons/ri'
import useVoiceAgent from '../../hooks/useVoiceAgent'
import ChatMessage from './ChatMessage'
import Waveform from './Waveform'
import SuggestionPrompts from './SuggestionPrompts'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('ai_chat_history')
    return saved ? JSON.parse(saved) : []
  })
  const [inputText, setInputText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [apiConfig, setApiConfig] = useState(null)
  const [isVoiceMode, setIsVoiceMode] = useState(false)

  const chatEndRef = useRef(null)
  const isStreamingRef = useRef(false)
  const sendMessageRef = useRef(null)

  // Fetch API configurations on startup
  useEffect(() => {
    fetch(`${BASE_URL}/api/ai/config`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setApiConfig(json.config)
      })
      .catch(err => console.error('[AI CONFIG FETCH] Failed:', err))
  }, [])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming, scrollToBottom])

  // Cache history
  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages))
  }, [messages])

  // Break circular dependency: handleSpeechRecognized uses the mutable ref
  const handleSpeechRecognized = useCallback((text) => {
    if (isStreamingRef.current) return
    if (sendMessageRef.current) {
      sendMessageRef.current(text)
    }
  }, [])

  const handleSpeechError = useCallback((error) => {
    console.error('[SPEECH RECOGNITION ERROR] Callback:', error)
  }, [])

  // Instantiate Voice Agent Hook
  const {
    isSupported: isVoiceSupported,
    isListening,
    isSpeaking,
    isMuted,
    browserWarning,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleMute
  } = useVoiceAgent({
    onSpeechRecognized: handleSpeechRecognized,
    onSpeechError: handleSpeechError
  })

  // Core send message logic with stream reading and API retry logic
  const sendMessage = useCallback(async (textToSend, retryCount = 0) => {
    const text = (textToSend || inputText).trim()
    if (!text) return

    setInputText('')
    setErrorMessage('')
    setIsStreaming(true)
    isStreamingRef.current = true

    // Add user message to state
    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Add placeholder assistant message for streaming
    const assistantPlaceholder = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantPlaceholder])

    try {
      const response = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.filter(m => m.content) })
      })

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.statusText} (${response.status})`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      let fullAssistantText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          if (trimmed === 'data: [DONE]') continue

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6))
              if (data.chunk) {
                fullAssistantText += data.chunk
                // Update the last message in real-time
                setMessages(prev => {
                  const copy = [...prev]
                  if (copy.length > 0) {
                    copy[copy.length - 1] = { role: 'assistant', content: fullAssistantText }
                  }
                  return copy
                })
              } else if (data.error) {
                throw new Error(data.error)
              }
            } catch {
              // Ignore partial parse failures
            }

          }
        }
      }

      setIsStreaming(false)
      isStreamingRef.current = false

      // Play synthesized audio if not muted and voice mode is active
      if (isVoiceMode && !isMuted) {
        speak(fullAssistantText)
      }
    } catch (err) {
      console.error('[AI CHAT FETCH ERROR] Attempt:', retryCount, err)

      // API Retry mechanism (exponential backoff, max 2 retries)
      if (retryCount < 2) {
        console.log(`[AI ASSISTANT] Retrying send (${retryCount + 1}/2)...`)
        // Rollback placeholders before retrying
        setMessages(updatedMessages)
        await new Promise(resolve => setTimeout(resolve, 800 * (retryCount + 1)))
        
        // Use ref to resolve TDZ recursion check
        if (sendMessageRef.current) {
          sendMessageRef.current(text, retryCount + 1)
        }
        return
      }

      // Show final error in UI
      setErrorMessage(err.message || 'Failed to generate response. Please try again.')
      setIsStreaming(false)
      isStreamingRef.current = false
      
      // Rollback assistant placeholder on complete failure
      setMessages(prev => prev.slice(0, -1))
    }
  }, [messages, inputText, isVoiceMode, isMuted, speak])

  // Sync mutable reference
  useEffect(() => {
    sendMessageRef.current = sendMessage
  }, [sendMessage])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your conversation history?')) {
      setMessages([])
      stopSpeaking()
      stopListening()
      setErrorMessage('')
    }
  }

  const handleToggleVoice = () => {
    if (!isVoiceSupported) {
      alert(browserWarning || 'Voice recognition is not supported on this browser.')
      return
    }

    setIsVoiceMode(prev => {
      const next = !prev
      if (next) {
        // Turn on continuous listening
        startListening(true)
      } else {
        stopListening()
        stopSpeaking()
      }
      return next
    })
  }

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-22 right-6 z-40 w-13 h-13 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110
          ${isOpen 
            ? 'bg-slate-900 text-white border border-slate-700 rotate-90' 
            : 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white hover:shadow-cyan-200/50 hover:shadow-lg border-2 border-white'
          }`}
        aria-label="Toggle AI Assistant"
        style={{ width: 52, height: 52 }}
      >
        {isOpen ? <RiCloseLine size={24} /> : <RiRobot2Line size={24} className="animate-pulse" />}
      </button>

      {/* Expandable Chat Panel */}
      <div
        className={`fixed bottom-36 right-6 z-40 w-[360px] sm:w-[400px] h-[550px] max-h-[75vh] 
          backdrop-blur-md bg-white/95 border border-slate-150 shadow-2xl rounded-2xl flex flex-col 
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-950 to-slate-900 text-white rounded-t-2xl border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-inner">
              <RiSparklingLine size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs tracking-wide">Sam Fitness Concierge</h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-[8px] uppercase tracking-widest text-slate-400 font-extrabold">
                  {apiConfig ? `${apiConfig.provider} (${apiConfig.mode})` : 'AI ACTIVE'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                title="Clear Chat History"
              >
                <RiDeleteBinLine size={16} />
              </button>
            )}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RiCloseLine size={18} />
            </button>
          </div>
        </div>

        {/* Message body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="flex flex-col h-full justify-between py-2">
              <div className="text-center my-auto px-4">
                <RiRobot2Line size={40} className="text-cyan-500 mx-auto mb-3 animate-bounce" />
                <h4 className="font-display font-black text-slate-800 text-sm mb-1">
                  How can I assist you today?
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[280px] mx-auto">
                  I can design customized exercise routines, detail our membership pricing, or answer general fitness & nutrition queries.
                </p>
              </div>
              <SuggestionPrompts onSelect={(prompt) => sendMessage(prompt)} />
            </div>
          ) : (
            <>
              {messages.map((m, idx) => (
                <ChatMessage key={idx} message={m} />
              ))}

              {/* Streaming loading indicator */}
              {isStreaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex w-full justify-start mb-4">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs">
              <RiAlertLine size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{errorMessage}</p>
                <button 
                  onClick={() => sendMessage(messages[messages.length - 2]?.content || '')}
                  className="flex items-center gap-1 font-bold text-red-900 hover:underline cursor-pointer"
                >
                  <RiRefreshLine size={13} />
                  Retry Send
                </button>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Live Audio Visualizer Wave */}
        {isVoiceMode && (
          <div className="px-4 py-1 bg-slate-100/50 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-bold flex items-center gap-1 select-none">
              <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-cyan-500 animate-ping' : isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`} />
              {isListening ? 'Listening for speech...' : isSpeaking ? 'AI speaking...' : 'Voice Standby'}
            </span>
            <div className="w-[180px]">
              <Waveform 
                mode={isListening ? 'listening' : isSpeaking ? 'speaking' : 'idle'} 
                active={isListening || isSpeaking} 
              />
            </div>
          </div>
        )}

        {/* Browser Warning alert */}
        {isVoiceMode && browserWarning && (
          <div className="px-4 py-1 bg-amber-50 text-amber-800 text-[9px] border-t border-amber-100 font-bold select-none text-center">
            {browserWarning}
          </div>
        )}

        {/* Footer Controls & Forms */}
        <div className="p-3 border-t border-slate-150 bg-white rounded-b-2xl">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5">
            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 shrink-0
                ${isVoiceMode 
                  ? 'bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600' 
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
              title={isVoiceMode ? 'Deactivate Voice Mode' : 'Activate Voice Agent'}
            >
              {isListening ? <RiMicLine size={16} className="animate-bounce" /> : <RiMicLine size={16} />}
            </button>

            {/* Mute Synth speech Button */}
            {isVoiceMode && (
              <button
                type="button"
                onClick={toggleMute}
                className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0
                  ${isMuted 
                    ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
              >
                {isMuted ? <RiVolumeMuteLine size={16} /> : <RiVolumeUpLine size={16} />}
              </button>
            )}

            {/* TextInput Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Speak or type a question...' : 'Ask Sam Fitness Concierge...'}
              disabled={isStreaming}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all text-slate-800 font-medium"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isStreaming || !inputText.trim()}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-cyan-500 hover:text-white disabled:bg-slate-100 disabled:text-slate-300 transition-all cursor-pointer shrink-0"
            >
              <RiSendPlane2Line size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
