import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { getDb } from './db/init.js'
import { apiLimiter } from './middleware/rateLimiter.js'

// Route imports
import contactRoutes     from './routes/contact.js'
import membershipRoutes  from './routes/membership.js'
import newsletterRoutes  from './routes/newsletter.js'
import classesRoutes     from './routes/classes.js'
import trainersRoutes    from './routes/trainers.js'
import adminRoutes       from './routes/admin.js'
import authRoutes        from './routes/auth.js'
import aiRoutes          from './routes/ai.js'


// ─── App setup ─────────────────────────────────────────────────────────────
const app  = express()
const PORT = process.env.PORT || 4000

// ─── Security & Parsing ────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ─── Request logging (simple) ──────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Sam Fitness API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/ai',         aiRoutes) // Bypass general apiLimiter for streaming chat
app.use('/api',            apiLimiter)

app.use('/api/contact',    contactRoutes)
app.use('/api/membership', membershipRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/classes',    classesRoutes)
app.use('/api/trainers',   trainersRoutes)
app.use('/api/admin',      adminRoutes)
app.use('/api/auth',       authRoutes)

// ─── API root ─────────────────────────────────────────────────────────────
app.get('/api', (_req, res) => {
  res.json({
    name: 'Sam Fitness REST API',
    version: '1.0.0',
    endpoints: {
      health:     'GET  /health',
      contact:    'POST /api/contact',
      membership: 'POST /api/membership',
      newsletter: 'POST /api/newsletter  |  POST /api/newsletter/unsubscribe',
      classes:    'GET  /api/classes  |  GET /api/classes/:id',
      trainers:   'GET  /api/trainers  |  GET /api/trainers/:id',
      admin: {
        login:       'POST  /api/admin/login',
        stats:       'GET   /api/admin/stats          (🔒)',
        contacts:    'GET   /api/admin/contacts       (🔒)',
        memberships: 'GET   /api/admin/memberships    (🔒)',
        newsletter:  'GET   /api/admin/newsletter     (🔒)',
      },
    },
  })
})

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  
  // Wildcard handler for SPA client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next()
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` })
})

// ─── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err)
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : err.message,
  })
})

// ─── Start ────────────────────────────────────────────────────────────────
async function start() {
  // Initialize DB & schema on startup
  await getDb()

  app.listen(PORT, () => {
    console.log('')
    console.log('╔══════════════════════════════════════════════╗')
    console.log('║       Sam Fitness Backend API — Running         ║')
    console.log(`║  🚀  http://localhost:${PORT}                    ║`)
    console.log(`║  📋  http://localhost:${PORT}/api                ║`)
    console.log(`║  ❤️   http://localhost:${PORT}/health             ║`)
    console.log('╚══════════════════════════════════════════════╝')
    console.log('')
  })
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
