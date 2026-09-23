// Calls the local Aivora API server (server/index.js), which proxies to
// Gemini and keeps the API key server-side. Conversations are persisted
// server-side — the client only sends the new message, not full history.
async function postChat(path, body) {
  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'The AI request failed.')
  }
  return data // { conversationId, content }
}

export function sendChatMessage({ conversationId, message, media }) {
  return postChat('/chat', {
    conversationId,
    message,
    media: media ? { mimeType: media.mimeType, base64: media.base64, name: media.name } : undefined,
  })
}

export function regenerateLastMessage(conversationId) {
  return postChat('/chat/regenerate', { conversationId })
}
