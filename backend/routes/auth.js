import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { getDb, dbRun, dbGet } from '../db/init.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// Helper: Hash password using built-in crypto module
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Zod schemas
const signupSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(80),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100)
})

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// POST /api/auth/signup
router.post('/signup', validate({ body: signupSchema }), async (req, res) => {
  await getDb()
  const { name, email, password } = req.body

  try {
    // Check if user already exists
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase()])
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' })
    }

    const hashedPassword = hashPassword(password)
    
    // Insert new user
    const result = await dbRun(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword]
    )

    return res.status(201).json({
      success: true,
      message: 'Signup successful! Please log in with your credentials.',
      userId: result.lastInsertRowid
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: 'Server error during signup.' })
  }
})

// POST /api/auth/login
router.post('/login', validate({ body: loginSchema }), async (req, res) => {
  await getDb()
  const { email, password } = req.body

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const hashedPassword = hashPassword(password)
    if (user.password !== hashedPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.id, role: 'member', email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key-12345',
      { expiresIn: '24h' }
    )

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        bmi: user.bmi,
        goal: user.goal,
        joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: 'Server error during login.' })
  }
})

export default router
