import { apiRequest } from './apiClient.js'

export async function listFiles() {
  const { files } = await apiRequest('/files')
  return files
}

export async function uploadFile({ name, mimeType, base64 }) {
  const { file } = await apiRequest('/files', {
    method: 'POST',
    body: JSON.stringify({ name, mimeType, base64 }),
  })
  return file
}

export function deleteFile(id) {
  return apiRequest(`/files/${id}`, { method: 'DELETE' })
}
