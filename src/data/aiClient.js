// Calls the local Aivora API server (server/index.js), which proxies to Claude
// and keeps the API key server-side. See README for setup.
export async function sendChatMessage(history) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || 'The AI request failed.')
  }

  return data.content
}
