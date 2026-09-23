import pool from './db.js'

export async function listFiles(userId) {
  const { rows } = await pool.query(
    `SELECT id, name, mime_type, size, created_at FROM files WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  )
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    mimeType: r.mime_type,
    size: r.size,
    createdAt: r.created_at,
  }))
}

export async function createFile(userId, { name, mimeType, size, data }) {
  const { rows } = await pool.query(
    `INSERT INTO files (user_id, name, mime_type, size, data) VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, mime_type, size, created_at`,
    [userId, name, mimeType, size, data],
  )
  const r = rows[0]
  return { id: r.id, name: r.name, mimeType: r.mime_type, size: r.size, createdAt: r.created_at }
}

export async function getFileOwner(fileId) {
  const { rows } = await pool.query('SELECT user_id FROM files WHERE id = $1', [fileId])
  return rows[0]?.user_id || null
}

export async function deleteFile(fileId) {
  await pool.query('DELETE FROM files WHERE id = $1', [fileId])
}
