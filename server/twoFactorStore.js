import crypto from 'crypto'
import pool from './db.js'

const PENDING_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function createPendingLogin(userId, remember) {
  await pool.query('DELETE FROM two_factor_pending WHERE expires_at <= $1', [Date.now()])
  const token = crypto.randomBytes(24).toString('hex')
  await pool.query('INSERT INTO two_factor_pending (token, user_id, remember, expires_at) VALUES ($1, $2, $3, $4)', [
    token,
    userId,
    Boolean(remember),
    Date.now() + PENDING_TTL_MS,
  ])
  return token
}

// Read-only lookup: does NOT delete the entry, so a wrong code can be
// retried until the pending login naturally expires.
export async function getPendingLogin(token) {
  await pool.query('DELETE FROM two_factor_pending WHERE expires_at <= $1', [Date.now()])
  const { rows } = await pool.query('SELECT * FROM two_factor_pending WHERE token = $1', [token])
  const entry = rows[0]
  if (!entry) return null
  return { userId: entry.user_id, remember: entry.remember }
}

export async function deletePendingLogin(token) {
  await pool.query('DELETE FROM two_factor_pending WHERE token = $1', [token])
}
