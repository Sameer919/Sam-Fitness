import initSqlJs from 'sql.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import crypto from 'crypto'
import pg from 'pg'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir   = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data')
const dbPath    = path.join(dataDir, 'samfitness.db')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let db = null // SQLite in-memory DB
let pgPool = null // PostgreSQL connection pool
let usePostgres = false

if (process.env.DATABASE_URL) {
  usePostgres = true
  console.log('[DATABASE] DATABASE_URL detected. Initializing PostgreSQL pool.')
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for hosted databases like Neon
    }
  })
}

// sql.js works in-memory; we persist by saving to disk after each write.
export async function getDb() {
  if (usePostgres) {
    // Test postgres connection
    const client = await pgPool.connect()
    try {
      await initPostgresSchema(client)
    } finally {
      client.release()
    }
    return pgPool
  }

  if (db) return db

  const wasmPath = path.join(__dirname, 'sql-wasm.wasm')
  const wasmBinary = fs.readFileSync(wasmPath)
  const SQL = await initSqlJs({ wasmBinary })

  // Load existing DB from disk if present
  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }

  await initSqliteSchema()
  return db
}

/** Persist the in-memory DB to disk */
export function saveDb() {
  if (usePostgres || !db) return
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
}

/** Helper: Translates standard SQLite queries to PostgreSQL format */
function translateSql(sql) {
  let translated = sql
  // 1. Replace DATE('now') with CURRENT_DATE
  translated = translated.replace(/DATE\('now'\)/gi, 'CURRENT_DATE')
  // 2. Replace DATE(created_at) with created_at::date
  translated = translated.replace(/DATE\(created_at\)/gi, 'created_at::date')
  
  // 3. Convert ? parameters to $1, $2, $3...
  let idx = 1
  translated = translated.replace(/\?/g, () => `$${idx++}`)
  return translated
}

/* ─── Helper: run a statement and auto-save / return lastInsertRowid ───────── */
export async function dbRun(sql, params = []) {
  if (usePostgres) {
    const client = await pgPool.connect()
    try {
      let query = translateSql(sql)
      // For inserts, append RETURNING id to capture the generated ID
      if (query.trim().toUpperCase().startsWith('INSERT ')) {
        query += ' RETURNING id'
      }
      const result = await client.query(query, params)
      const lastInsertRowid = result.rows[0]?.id || null
      return { lastInsertRowid }
    } catch (err) {
      console.error('[DATABASE ERROR] dbRun failed:', err)
      throw err
    } finally {
      client.release()
    }
  } else {
    db.run(sql, params)
    saveDb()
    const result = db.exec('SELECT last_insert_rowid() as id')
    return { lastInsertRowid: result[0]?.values[0]?.[0] ?? null }
  }
}

/* ─── Helper: get single row ─────────────────────────────────────────────── */
export async function dbGet(sql, params = []) {
  if (usePostgres) {
    const client = await pgPool.connect()
    try {
      const query = translateSql(sql)
      const result = await client.query(query, params)
      return result.rows[0] || null
    } catch (err) {
      console.error('[DATABASE ERROR] dbGet failed:', err)
      throw err
    } finally {
      client.release()
    }
  } else {
    const stmt = db.prepare(sql)
    stmt.bind(params)
    if (stmt.step()) {
      const row = stmt.getAsObject()
      stmt.free()
      return row
    }
    stmt.free()
    return null
  }
}

/* ─── Helper: get all rows ────────────────────────────────────────────────── */
export async function dbAll(sql, params = []) {
  if (usePostgres) {
    const client = await pgPool.connect()
    try {
      const query = translateSql(sql)
      const result = await client.query(query, params)
      return result.rows
    } catch (err) {
      console.error('[DATABASE ERROR] dbAll failed:', err)
      throw err
    } finally {
      client.release()
    }
  } else {
    const result = db.exec(sql, params)
    if (!result.length) return []
    const { columns, values } = result[0]
    return values.map(row =>
      Object.fromEntries(columns.map((col, i) => [col, row[i]]))
    )
  }
}

/* ─── PostgreSQL Schema Migrations & Seeding ────────────────────────────── */
async function initPostgresSchema(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id          SERIAL PRIMARY KEY,
      first_name  VARCHAR(100) NOT NULL,
      last_name   VARCHAR(100) NOT NULL,
      email       VARCHAR(150) NOT NULL,
      phone       VARCHAR(30) DEFAULT '',
      subject     VARCHAR(200) NOT NULL,
      message     TEXT NOT NULL,
      interests   TEXT DEFAULT '[]',
      ip_address  VARCHAR(50) DEFAULT '',
      status      VARCHAR(20) DEFAULT 'new',
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS membership_leads (
      id          SERIAL PRIMARY KEY,
      first_name  VARCHAR(100) NOT NULL,
      last_name   VARCHAR(100) NOT NULL,
      email       VARCHAR(150) NOT NULL,
      phone       VARCHAR(30) DEFAULT '',
      plan        VARCHAR(20) NOT NULL,
      billing     VARCHAR(20) DEFAULT 'monthly',
      goal        TEXT DEFAULT '',
      assigned_trainer VARCHAR(100) DEFAULT '',
      source      VARCHAR(100) DEFAULT 'Web Enquiry',
      value       INTEGER DEFAULT 0,
      probability INTEGER DEFAULT 20,
      next_followup VARCHAR(50) DEFAULT '',
      ip_address  VARCHAR(50) DEFAULT '',
      status      VARCHAR(20) DEFAULT 'new',
      payment_status VARCHAR(25) DEFAULT 'pending',
      transaction_id VARCHAR(50) DEFAULT '',
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lead_notes (
      id          SERIAL PRIMARY KEY,
      lead_id     INTEGER NOT NULL,
      note        TEXT NOT NULL,
      author      VARCHAR(100) DEFAULT 'Admin',
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      id         SERIAL PRIMARY KEY,
      email      VARCHAR(150) NOT NULL UNIQUE,
      name       VARCHAR(100) DEFAULT '',
      ip_address VARCHAR(50) DEFAULT '',
      active     INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_log (
      id         SERIAL PRIMARY KEY,
      action     VARCHAR(50) NOT NULL,
      detail     TEXT DEFAULT '',
      ip_address VARCHAR(50) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      email       VARCHAR(150) NOT NULL UNIQUE,
      password    VARCHAR(200) NOT NULL,
      tier        VARCHAR(50) DEFAULT 'Starter',
      bmi         VARCHAR(20) DEFAULT '22.5',
      goal        VARCHAR(200) DEFAULT 'Cardio Conditioning',
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Seed default member user if not exists
  const existingUser = await client.query('SELECT id FROM users WHERE email = $1', ['member@samfitness.com'])
  if (existingUser.rowCount === 0) {
    const hash = crypto.createHash('sha256').update('member123').digest('hex')
    await client.query(
      "INSERT INTO users (name, email, password, tier, bmi, goal) VALUES ($1, $2, $3, $4, $5, $6)",
      ['Rahul Verma', 'member@samfitness.com', hash, 'Pro Member', '22.4', 'Fat Loss & Cardio Conditioning']
    )
  }

  // Seed default leads for CRM preview
  const existingLead = await client.query('SELECT id FROM membership_leads WHERE email = $1', ['amit.patel@gmail.com'])
  if (existingLead.rowCount === 0) {
    const resAmit = await client.query(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      ['Amit', 'Patel', 'amit.patel@gmail.com', '+91 98111 22222', 'pro', 'annual', 'Fat Loss & Cardio Conditioning', 'Aryan Kapoor', 'Walk-in', 52788, 60, '2026-06-05', 'tour']
    )
    const amitId = resAmit.rows[0].id
    await client.query('INSERT INTO lead_notes (lead_id, note, author) VALUES ($1, $2, $3)', [amitId, 'Walked in for a gym tour. Very interested in powerlifting and wants a personal trainer.', 'Admin'])
    await client.query('INSERT INTO lead_notes (lead_id, note, author) VALUES ($1, $2, $3)', [amitId, 'Tour scheduled for Friday at 6 PM. Assigned to Aryan.', 'Admin'])

    const resRohan = await client.query(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      ['Rohan', 'Deshmukh', 'rohan.d@yahoo.com', '+91 98222 33333', 'elite', 'monthly', 'Muscle Gain', '', 'Web Enquiry', 8999, 20, '2026-06-04', 'new']
    )
    const rohanId = resRohan.rows[0].id
    await client.query('INSERT INTO lead_notes (lead_id, note, author) VALUES ($1, $2, $3)', [rohanId, 'Submitted a web inquiry. Looking to build strength.', 'Admin'])

    const resKiran = await client.query(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      ['Kiran', 'Rao', 'kiran.rao@hotmail.com', '+91 98333 44444', 'pro', 'monthly', 'Yoga & Flexibility', 'Maya Reddy', 'Referral', 16497, 80, '2026-06-06', 'trial']
    )
    const kiranId = resKiran.rows[0].id
    await client.query('INSERT INTO lead_notes (lead_id, note, author) VALUES ($1, $2, $3)', [kiranId, 'Signed up for a 7-day free trial. Attended Maya\'s class.', 'Admin'])
    await client.query('INSERT INTO lead_notes (lead_id, note, author) VALUES ($1, $2, $3)', [kiranId, 'Enjoys Maya\'s classes. Will follow up after trial ends on Saturday.', 'Admin'])
  }
}

/* ─── SQLite Schema Migrations & Seeding ────────────────────────────────── */
async function initSqliteSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name  TEXT NOT NULL,
      last_name   TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT DEFAULT '',
      subject     TEXT NOT NULL,
      message     TEXT NOT NULL,
      interests   TEXT DEFAULT '[]',
      ip_address  TEXT DEFAULT '',
      status      TEXT DEFAULT 'new',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS membership_leads (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name  TEXT NOT NULL,
      last_name   TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT DEFAULT '',
      plan        TEXT NOT NULL,
      billing     TEXT DEFAULT 'monthly',
      goal        TEXT DEFAULT '',
      assigned_trainer TEXT DEFAULT '',
      source      TEXT DEFAULT 'Web Enquiry',
      value       INTEGER DEFAULT 0,
      probability INTEGER DEFAULT 20,
      next_followup TEXT DEFAULT '',
      ip_address  TEXT DEFAULT '',
      status      TEXT DEFAULT 'new',
      payment_status TEXT DEFAULT 'pending',
      transaction_id TEXT DEFAULT '',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lead_notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id     INTEGER NOT NULL,
      note        TEXT NOT NULL,
      author      TEXT DEFAULT 'Admin',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE,
      name       TEXT DEFAULT '',
      ip_address TEXT DEFAULT '',
      active     INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      action     TEXT NOT NULL,
      detail     TEXT DEFAULT '',
      ip_address TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      password    TEXT NOT NULL,
      tier        TEXT DEFAULT 'Starter',
      bmi         TEXT DEFAULT '22.5',
      goal        TEXT DEFAULT 'Cardio Conditioning',
      created_at  TEXT DEFAULT (datetime('now'))
    );
  `)
  saveDb()
  
  // Seed default user if not exists
  const existing = await dbGet('SELECT id FROM users WHERE email = ?', ['member@samfitness.com'])
  if (!existing) {
    const hash = crypto.createHash('sha256').update('member123').digest('hex')
    db.run(
      "INSERT INTO users (name, email, password, tier, bmi, goal) VALUES (?, ?, ?, ?, ?, ?)",
      ['Rahul Verma', 'member@samfitness.com', hash, 'Pro Member', '22.4', 'Fat Loss & Cardio Conditioning']
    )
    saveDb()
  }

  // Seed default membership leads for CRM preview
  const existingLead = await dbGet('SELECT id FROM membership_leads WHERE email = ?', ['amit.patel@gmail.com'])
  if (!existingLead) {
    db.run(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Amit', 'Patel', 'amit.patel@gmail.com', '+91 98111 22222', 'pro', 'annual', 'Fat Loss & Cardio Conditioning', 'Aryan Kapoor', 'Walk-in', 52788, 60, '2026-06-05', 'tour']
    )
    db.run(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Rohan', 'Deshmukh', 'rohan.d@yahoo.com', '+91 98222 33333', 'elite', 'monthly', 'Muscle Gain', '', 'Web Enquiry', 8999, 20, '2026-06-04', 'new']
    )
    db.run(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Kiran', 'Rao', 'kiran.rao@hotmail.com', '+91 98333 44444', 'pro', 'monthly', 'Yoga & Flexibility', 'Maya Reddy', 'Referral', 16497, 80, '2026-06-06', 'trial']
    )
    db.run(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Sneha', 'Kulkarni', 'sneha.k@outlook.com', '+91 98444 55555', 'basic', 'monthly', 'Cardio Conditioning', 'Dev Malhotra', 'Instagram', 35988, 100, '', 'converted']
    )
    db.run(
      `INSERT INTO membership_leads (first_name, last_name, email, phone, plan, billing, goal, assigned_trainer, source, value, probability, next_followup, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Vikram', 'Malhotra', 'vikram.m@gmail.com', '+91 98555 66666', 'elite', 'annual', 'Strength Building', '', 'Walk-in', 86388, 0, '', 'lost']
    )
    saveDb()

    // Seed notes for these leads
    const leads = await dbAll('SELECT id, first_name FROM membership_leads')
    leads.forEach(l => {
      if (l.first_name === 'Amit') {
        db.run('INSERT INTO lead_notes (lead_id, note, author) VALUES (?, ?, ?)', [l.id, 'Walked in for a gym tour. Very interested in powerlifting and wants a personal trainer.', 'Admin'])
        db.run('INSERT INTO lead_notes (lead_id, note, author) VALUES (?, ?, ?)', [l.id, 'Tour scheduled for Friday at 6 PM. Assigned to Aryan.', 'Admin'])
      } else if (l.first_name === 'Rohan') {
        db.run('INSERT INTO lead_notes (lead_id, note, author) VALUES (?, ?, ?)', [l.id, 'Submitted a web inquiry. Looking to build strength.', 'Admin'])
      } else if (l.first_name === 'Kiran') {
        db.run('INSERT INTO lead_notes (lead_id, note, author) VALUES (?, ?, ?)', [l.id, 'Signed up for a 7-day free trial. Attended Maya\'s class.', 'Admin'])
        db.run('INSERT INTO lead_notes (lead_id, note, author) VALUES (?, ?, ?)', [l.id, 'Enjoys Maya\'s classes. Will follow up after trial ends on Saturday.', 'Admin'])
      } else if (l.first_name === 'Sneha') {
        db.run('INSERT INTO lead_notes (lead_id, note, author) VALUES (?, ?, ?)', [l.id, 'Referred by Priya. Signed up for Pro annual membership immediately.', 'Admin'])
      }
    })
    saveDb()
  }

  console.log('✅ Database ready at:', dbPath)
}
