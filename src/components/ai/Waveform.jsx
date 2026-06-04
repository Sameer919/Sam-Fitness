import { useEffect, useRef } from 'react'

export default function Waveform({ mode = 'idle', active = false }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set high DPI support
    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Base configuration for waves based on active modes
      let waveCount = 3
      let baseAmplitude, baseFrequency, speed, colors

      if (mode === 'listening') {
        baseAmplitude = active ? 18 : 6
        baseFrequency = 0.12
        speed = 0.15
        // Sky Blue / Cyan palette
        colors = [
          'rgba(6, 182, 212, 0.7)',  // Cyan-500
          'rgba(56, 189, 248, 0.5)', // Sky-400
          'rgba(14, 116, 144, 0.3)'  // Cyan-700
        ]
      } else if (mode === 'speaking') {
        baseAmplitude = active ? 14 : 5
        baseFrequency = 0.06
        speed = 0.07
        // Ocean Blue / Indigo palette
        colors = [
          'rgba(59, 130, 246, 0.7)',  // Blue-500
          'rgba(6, 182, 212, 0.5)',   // Cyan-500
          'rgba(99, 102, 241, 0.3)'   // Indigo-500
        ]
      } else {
        // Idle: static, flat slow-moving line
        baseAmplitude = 2
        baseFrequency = 0.03
        speed = 0.02
        colors = ['rgba(148, 163, 184, 0.2)'] // Slate-400
        waveCount = 1
      }

      phaseRef.current += speed

      // Draw multiple overlapping sine waves
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        ctx.lineWidth = i === 0 ? 2 : 1.5
        ctx.strokeStyle = colors[i % colors.length]

        const phaseOffset = i * (Math.PI / 3)
        const amplitudeMod = 1 - (i * 0.25)
        const freqMod = 1 + (i * 0.15)

        for (let x = 0; x < width; x++) {
          // Normalised coordinates for fade at boundaries
          const normalizedX = x / width
          const envelope = Math.sin(normalizedX * Math.PI) // Fades to 0 at edges

          // Add minor noise if active
          const noise = active ? Math.sin(x * 0.5 + phaseRef.current * 2) * 1.5 : 0
          
          const y = (height / 2) + 
            Math.sin(x * baseFrequency * freqMod + phaseRef.current + phaseOffset) * 
            baseAmplitude * amplitudeMod * envelope + noise

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    // Handle resizing
    const handleResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [mode, active])

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-10 select-none pointer-events-none transition-all duration-300"
      style={{ minHeight: '32px' }}
    />
  )
}
