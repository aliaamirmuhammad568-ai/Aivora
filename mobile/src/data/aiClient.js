import { apiRequest } from './apiClient.js'

export function sendChatMessage({ conversationId, message, media }) {
  return apiRequest('/chat', {
    method: 'POST',
    body: JSON.stringify({
      conversationId,
      message,
      media: media ? { mimeType: media.mimeType, base64: media.base64, name: media.name } : undefined,
    }),
  })
}

export function regenerateLastMessage(conversationId) {
  return apiRequest('/chat/regenerate', { method: 'POST', body: JSON.stringify({ conversationId }) })
}
