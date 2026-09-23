import pool from './db.js'

function truncateTitle(text, max = 50) {
  const clean = text.trim().replace(/\s+/g, ' ')
  if (clean.length <= max) return clean || 'New conversation'
  return `${clean.slice(0, max).trim()}…`
}

export async function listConversations(userId) {
  const { rows } = await pool.query(
    `SELECT c.id, c.title, c.updated_at,
            (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_message,
            (SELECT count(*) FROM messages m WHERE m.conversation_id = c.id)::int AS message_count
     FROM conversations c
     WHERE c.user_id = $1
     ORDER BY c.updated_at DESC`,
    [userId],
  )
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    updatedAt: r.updated_at,
    preview: r.last_message ? r.last_message.slice(0, 100) : '',
    messageCount: r.message_count,
  }))
}

export async function createConversation(userId, firstMessageText) {
  const title = truncateTitle(firstMessageText || 'New conversation')
  const { rows } = await pool.query(
    `INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING id, title, updated_at`,
    [userId, title],
  )
  return rows[0]
}

export async function getConversationOwner(conversationId) {
  const { rows } = await pool.query('SELECT user_id FROM conversations WHERE id = $1', [conversationId])
  return rows[0]?.user_id || null
}

export async function getMessages(conversationId) {
  const { rows } = await pool.query(
    `SELECT id, role, content, media_mime_type, media_data, media_name, created_at
     FROM messages WHERE conversation_id = $1 ORDER BY id ASC`,
    [conversationId],
  )
  return rows.map((r) => ({
    id: r.id,
    role: r.role,
    content: r.content,
    media: r.media_mime_type ? { mimeType: r.media_mime_type, base64: r.media_data, name: r.media_name } : null,
    createdAt: r.created_at,
  }))
}

export async function addMessage(conversationId, { role, content, media }) {
  const { rows } = await pool.query(
    `INSERT INTO messages (conversation_id, role, content, media_mime_type, media_data, media_name)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
    [conversationId, role, content, media?.mimeType || null, media?.base64 || null, media?.name || null],
  )
  await pool.query('UPDATE conversations SET updated_at = now() WHERE id = $1', [conversationId])
  return rows[0]
}

export async function deleteLastAssistantMessage(conversationId) {
  await pool.query(
    `DELETE FROM messages WHERE id = (
       SELECT id FROM messages WHERE conversation_id = $1 AND role = 'assistant' ORDER BY id DESC LIMIT 1
     )`,
    [conversationId],
  )
}

export async function renameConversation(conversationId, title) {
  await pool.query('UPDATE conversations SET title = $1 WHERE id = $2', [title.trim().slice(0, 100), conversationId])
}

export async function deleteConversation(conversationId) {
  await pool.query('DELETE FROM conversations WHERE id = $1', [conversationId])
}
