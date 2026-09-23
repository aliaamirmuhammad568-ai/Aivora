async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}

export async function listConversations() {
  const { conversations } = await request('/conversations')
  return conversations
}

export async function getConversationMessages(id) {
  const { messages } = await request(`/conversations/${id}/messages`)
  return messages
}

export function renameConversation(id, title) {
  return request(`/conversations/${id}`, { method: 'PATCH', body: JSON.stringify({ title }) })
}

export function deleteConversation(id) {
  return request(`/conversations/${id}`, { method: 'DELETE' })
}
