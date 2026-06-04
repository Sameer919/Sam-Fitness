import { Router } from 'express'
import { z } from 'zod'
import { getDb, dbRun } from '../db/init.js'
import { validate } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { sendContactNotification, sendAutoReply } from '../utils/email.js'

const router = Router()

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(80),
  lastName:  z.string().min(1, 'Last name is required').max(80),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().max(20).optional().default(''),
  subject:   z.enum([
    'General Inquiry',
    'Membership Plans',
    'Personal Training',
    'Corporate Wellness',
    'Media / PR',
    'Other',
  ], { errorMap: () => ({ message: 'Please select a valid subject' }) }),
  message:   z.string().min(10, 'Message must be at least 10 characters').max(2000),
  interests: z.array(z.string()).optional().default([]),
})

// POST /api/contact
router.post('/', formLimiter, validate({ body: contactSchema }), async (req, res) => {
  await getDb() // ensure DB is initialized
  const { firstName, lastName, email, phone, subject, message, interests } = req.body
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''

  const result = await dbRun(
    `INSERT INTO contacts (first_name, last_name, email, phone, subject, message, interests, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, phone || '', subject, message, JSON.stringify(interests), ip]
  )

  // Send emails (fire-and-forget)
  sendContactNotification({ firstName, lastName, email, phone, subject, message, interests })
  sendAutoReply(email, firstName)

  return res.status(201).json({
    success: true,
    message: `Thanks ${firstName}! We'll get back to you within 24 hours.`,
    id: result.lastInsertRowid,
  })
})

export default router
