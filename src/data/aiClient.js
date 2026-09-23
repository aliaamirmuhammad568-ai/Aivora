// Calls the local Aivora API server (server/index.js), which proxies to Claude
// and keeps the API key server-side. See README for setup.
export async function sendChatMessage(history) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      messages: history.map((m) => ({
        role: m.role,
        content: m.content,
        // Only send media inline data for the message that actually has it —
        // keeps the payload light and avoids re-uploading old images/videos.
        ...(m.media ? { media: { mimeType: m.media.mimeType, base64: m.media.base64 } } : {}),
      })),
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || 'The AI request failed.')
  }

  return data.content
}
