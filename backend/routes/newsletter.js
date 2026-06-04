import { Router } from 'express'
import { z } from 'zod'
import { getDb, dbRun, dbGet } from '../db/init.js'
import { validate } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'

const router = Router()

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name:  z.string().max(100).optional().default(''),
})

// POST /api/newsletter
router.post('/', formLimiter, validate({ body: newsletterSchema }), async (req, res) => {
  await getDb()
  const { email, name } = req.body
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''

  const existing = await dbGet('SELECT id, active FROM newsletter WHERE email = ?', [email])

  if (existing) {
    if (existing.active) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true,
      })
    }
    await dbRun('UPDATE newsletter SET active = 1, name = ? WHERE email = ?', [name, email])
    return res.status(200).json({ success: true, message: 'Welcome back! You have been re-subscribed.' })
  }

  await dbRun('INSERT INTO newsletter (email, name, ip_address) VALUES (?, ?, ?)', [email, name, ip])

  return res.status(201).json({
    success: true,
    message: 'Thank you for subscribing! Expect exclusive tips and offers in your inbox.',
  })
})

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', validate({ body: z.object({ email: z.string().email() }) }), async (req, res) => {
  await getDb()
  const { email } = req.body
  const existing = await dbGet('SELECT id FROM newsletter WHERE email = ?', [email])
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Email not found in our newsletter list.' })
  }
  await dbRun('UPDATE newsletter SET active = 0 WHERE email = ?', [email])
  return res.json({ success: true, message: 'You have been successfully unsubscribed.' })
})

export default router
