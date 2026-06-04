import { Router } from 'express'
import { z } from 'zod'
import { getDb, dbRun } from '../db/init.js'
import { validate } from '../middleware/validate.js'
import { formLimiter } from '../middleware/rateLimiter.js'
import { sendMembershipNotification, sendAutoReply } from '../utils/email.js'

const router = Router()

const membershipSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName:  z.string().min(1).max(80),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().max(20).optional().default(''),
  plan:      z.enum(['basic', 'pro', 'elite'], {
    errorMap: () => ({ message: 'Plan must be basic, pro, or elite' }),
  }),
  billing:   z.enum(['monthly', 'annual']).optional().default('monthly'),
  goal:      z.string().max(500).optional().default(''),
})

// POST /api/membership
router.post('/', formLimiter, validate({ body: membershipSchema }), async (req, res) => {
  await getDb()
  const { firstName, lastName, email, phone, plan, billing, goal } = req.body
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''

  const result = await dbRun(
    `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, phone || '', plan, billing, goal || '', ip]
  )

  sendMembershipNotification({ firstName, lastName, email, phone, plan, billing, goal })
  sendAutoReply(email, firstName)

  return res.status(201).json({
    success: true,
    message: `Welcome to Sam Fitness ${firstName}! Your ${plan} plan enquiry is registered. Please scan to complete payment.`,
    id: result.lastInsertRowid,
  })
})

// PATCH /api/membership/:id/payment
router.patch('/:id/payment', async (req, res) => {
  await getDb()
  const { transactionId } = req.body
  const leadId = parseInt(req.params.id)

  if (!transactionId || transactionId.trim().length < 5) {
    return res.status(422).json({ success: false, message: 'Invalid or missing transaction reference ID.' })
  }

  await dbRun(
    "UPDATE membership_leads SET payment_status = 'paid', transaction_id = ?, status = 'trial' WHERE id = ?",
    [transactionId, leadId]
  )

  return res.json({
    success: true,
    message: 'Payment confirmed successfully! Welcome to Sam Fitness!'
  })
})

export default router

