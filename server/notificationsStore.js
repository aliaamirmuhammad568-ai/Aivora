import pool from './db.js'

const DEFAULTS = { product: true, security: true, marketing: false, weekly: true }

export async function getPreferences(userId) {
  const { rows } = await pool.query('SELECT product, security, marketing, weekly FROM notification_preferences WHERE user_id = $1', [
    userId,
  ])
  if (!rows[0]) return { ...DEFAULTS }
  return rows[0]
}

export async function setPreferences(userId, prefs) {
  const merged = { ...DEFAULTS, ...prefs }
  await pool.query(
    `INSERT INTO notification_preferences (user_id, product, security, marketing, weekly)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET
       product = EXCLUDED.product, security = EXCLUDED.security,
       marketing = EXCLUDED.marketing, weekly = EXCLUDED.weekly`,
    [userId, merged.product, merged.security, merged.marketing, merged.weekly],
  )
  return merged
}
