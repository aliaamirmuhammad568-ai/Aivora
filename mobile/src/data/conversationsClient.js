import { apiRequest } from './apiClient.js'

export async function listConversations() {
  const { conversations } = await apiRequest('/conversations')
  return conversations
}

export async function getConversationMessages(id) {
  const { messages } = await apiRequest(`/conversations/${id}/messages`)
  return messages
}

export function renameConversation(id, title) {
  return apiRequest(`/conversations/${id}`, { method: 'PATCH', body: JSON.stringify({ title }) })
}

export function deleteConversation(id) {
  return apiRequest(`/conversations/${id}`, { method: 'DELETE' })
}
