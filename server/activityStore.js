import pool from './db.js'

export async function logActivity(userId, type, label) {
  await pool.query('INSERT INTO activity_log (user_id, type, label) VALUES ($1, $2, $3)', [userId, type, label])
}

export async function listActivity(userId, limit = 8) {
  const { rows } = await pool.query(
    'SELECT id, type, label, created_at FROM activity_log WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit],
  )
  return rows.map((r) => ({ id: r.id, type: r.type, label: r.label, createdAt: r.created_at }))
}
