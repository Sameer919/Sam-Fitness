import { Router } from 'express'
import { streamChatCompletion, getAIConfig } from '../services/aiService.js'

const router = Router()

// ── GET /api/ai/config ────────────────────────────────────────────────────
router.get('/config', (req, res) => {
  try {
    const config = getAIConfig()
    res.json({ success: true, config })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/ai/chat ─────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(422).json({ success: false, message: 'Missing or invalid messages parameter' })
  }

  // Set headers for Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders() // Flush headers to establish stream

  // Handle client disconnection
  let isClosed = false
  req.on('close', () => {
    isClosed = true
  })

  try {
    const stream = streamChatCompletion(messages)
    
    for await (const chunk of stream) {
      if (isClosed) break
      
      // SSE structure: data: <json>\n\n
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`)
    }

    if (!isClosed) {
      res.write('data: [DONE]\n\n')
      res.end()
    }
  } catch (err) {
    console.error('[AI ROUTE ERROR]', err)
    if (!isClosed) {
      res.write(`data: ${JSON.stringify({ error: err.message || 'Internal streaming error' })}\n\n`)
      res.end()
    }
  }
})

export default router
