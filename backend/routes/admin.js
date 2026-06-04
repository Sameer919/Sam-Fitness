import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { getDb, dbRun, dbGet, dbAll } from '../db/init.js'
import { authMiddleware } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// ── POST /api/admin/login ─────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  )

  await getDb()
  await dbRun('INSERT INTO admin_log (action, detail, ip_address) VALUES (?, ?, ?)', [
    'login',
    `Admin ${username} logged in`,
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
  ])

  res.json({ success: true, token, expiresIn: '12h' })
})

// All routes below require JWT
router.use(authMiddleware)

// ── GET /api/admin/stats ──────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  await getDb()

  const contactsTotal = await dbGet('SELECT COUNT(*) as n FROM contacts')
  const contactsNew = await dbGet("SELECT COUNT(*) as n FROM contacts WHERE status = 'new'")
  const contactsToday = await dbGet("SELECT COUNT(*) as n FROM contacts WHERE DATE(created_at) = DATE('now')")

  const membershipsTotal = await dbGet('SELECT COUNT(*) as n FROM membership_leads')
  const membershipsNew = await dbGet("SELECT COUNT(*) as n FROM membership_leads WHERE status = 'new'")
  
  const planBasic = await dbGet("SELECT COUNT(*) as n FROM membership_leads WHERE plan = 'basic'")
  const planPro = await dbGet("SELECT COUNT(*) as n FROM membership_leads WHERE plan = 'pro'")
  const planElite = await dbGet("SELECT COUNT(*) as n FROM membership_leads WHERE plan = 'elite'")

  const newsletterTotal = await dbGet('SELECT COUNT(*) as n FROM newsletter')
  const newsletterActive = await dbGet('SELECT COUNT(*) as n FROM newsletter WHERE active = 1')

  const stats = {
    contacts: {
      total: contactsTotal?.n ?? 0,
      new:   contactsNew?.n ?? 0,
      today: contactsToday?.n ?? 0,
    },
    memberships: {
      total: membershipsTotal?.n ?? 0,
      new:   membershipsNew?.n ?? 0,
      byPlan: {
        basic: planBasic?.n ?? 0,
        pro:   planPro?.n ?? 0,
        elite: planElite?.n ?? 0,
      },
    },
    newsletter: {
      total:  newsletterTotal?.n ?? 0,
      active: newsletterActive?.n ?? 0,
    },
  }

  res.json({ success: true, data: stats })
})

// ── GET /api/admin/contacts ───────────────────────────────────────────────
router.get('/contacts', async (req, res) => {
  await getDb()
  const { page = 1, limit = 20, status } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)

  const whereClause = status ? `WHERE status = '${status}'` : ''
  const data = await dbAll(
    `SELECT * FROM contacts ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`
  )
  const totalRow = await dbGet(`SELECT COUNT(*) as n FROM contacts ${whereClause}`)
  const total = totalRow?.n ?? 0

  const formatted = data.map(row => ({
    ...row,
    interests: row.interests ? JSON.parse(row.interests) : [],
  }))

  res.json({ success: true, data: formatted, total, page: parseInt(page), limit: parseInt(limit) })
})

// ── PATCH /api/admin/contacts/:id/status ─────────────────────────────────
router.patch('/contacts/:id/status', async (req, res) => {
  await getDb()
  const { status } = req.body
  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(422).json({ success: false, message: 'Invalid status' })
  }
  await dbRun('UPDATE contacts SET status = ? WHERE id = ?', [status, parseInt(req.params.id)])
  res.json({ success: true, message: 'Status updated' })
})

// ── GET /api/admin/memberships ────────────────────────────────────────────
router.get('/memberships', async (req, res) => {
  await getDb()
  const { page = 1, limit = 20, plan, status } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)

  const conditions = []
  if (plan)   conditions.push(`plan = '${plan}'`)
  if (status) conditions.push(`status = '${status}'`)
  const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''

  const data  = await dbAll(`SELECT * FROM membership_leads ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`)
  const totalRow = await dbGet(`SELECT COUNT(*) as n FROM membership_leads ${whereClause}`)
  const total = totalRow?.n ?? 0

  res.json({ success: true, data, total, page: parseInt(page), limit: parseInt(limit) })
})

// ── PATCH /api/admin/memberships/:id/status ───────────────────────────────
router.patch('/memberships/:id/status', async (req, res) => {
  await getDb()
  const { status } = req.body
  if (!['new', 'read', 'replied', 'converted'].includes(status)) {
    return res.status(422).json({ success: false, message: 'Invalid status' })
  }
  await dbRun('UPDATE membership_leads SET status = ? WHERE id = ?', [status, parseInt(req.params.id)])
  res.json({ success: true, message: 'Status updated' })
})

// ── GET /api/admin/newsletter ─────────────────────────────────────────────
router.get('/newsletter', async (req, res) => {
  await getDb()
  const { page = 1, limit = 50, active } = req.query
  const offset = (parseInt(page) - 1) * parseInt(limit)

  const whereClause = active !== undefined ? `WHERE active = ${active === '1' ? 1 : 0}` : ''
  const data  = await dbAll(`SELECT * FROM newsletter ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`)
  const totalRow = await dbGet('SELECT COUNT(*) as n FROM newsletter')
  const total = totalRow?.n ?? 0

  res.json({ success: true, data, total, page: parseInt(page), limit: parseInt(limit) })
})

export default router
