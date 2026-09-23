import crypto from 'crypto'
import pool, { dbEnabled } from './db.js'

export { dbEnabled }

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

function rowToUser(row) {
  if (!row) return null
  return {
    id: row.id,
    provider: row.provider,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    avatar: row.avatar,
    createdAt: row.created_at,
  }
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return rowToUser(rows[0])
}

export async function findByEmail(email) {
  if (!email) return null
  const { rows } = await pool.query('SELECT * FROM users WHERE lower(email) = lower($1)', [email])
  return rowToUser(rows[0])
}

export async function createLocalUser({ name, email, passwordHash }) {
  const id = `local:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const { rows } = await pool.query(
    `INSERT INTO users (id, provider, name, email, password_hash, avatar)
     VALUES ($1, 'local', $2, $3, $4, NULL)
     RETURNING *`,
    [id, name, email, passwordHash],
  )
  return rowToUser(rows[0])
}

export async function upsertOAuthUser(profile, provider) {
  const id = `${provider}:${profile.id}`
  const name = profile.displayName || profile.username || 'Aivora User'
  const email = profile.emails?.[0]?.value || null
  const avatar = profile.photos?.[0]?.value || null

  const { rows } = await pool.query(
    `INSERT INTO users (id, provider, name, email, avatar)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = COALESCE(EXCLUDED.email, users.email),
       avatar = COALESCE(EXCLUDED.avatar, users.avatar)
     RETURNING *`,
    [id, provider, name, email, avatar],
  )
  return rowToUser(rows[0])
}

export async function updatePassword(id, passwordHash) {
  const { rows } = await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *', [passwordHash, id])
  return rowToUser(rows[0])
}

export function toPublicUser(user) {
  if (!user) return null
  const { passwordHash, ...publicFields } = user
  return publicFields
}

// --- Password reset tokens ---

export async function createResetToken(userId) {
  await pool.query('DELETE FROM reset_tokens WHERE expires_at <= $1', [Date.now()])
  await pool.query('DELETE FROM reset_tokens WHERE user_id = $1', [userId]) // invalidate older tokens
  const token = crypto.randomBytes(32).toString('hex')
  await pool.query('INSERT INTO reset_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [
    token,
    userId,
    Date.now() + RESET_TOKEN_TTL_MS,
  ])
  return token
}

export async function consumeResetToken(token) {
  await pool.query('DELETE FROM reset_tokens WHERE expires_at <= $1', [Date.now()])
  const { rows } = await pool.query('SELECT * FROM reset_tokens WHERE token = $1', [token])
  const entry = rows[0]
  if (!entry) return null
  await pool.query('DELETE FROM reset_tokens WHERE token = $1', [token])
  return findById(entry.user_id)
}
