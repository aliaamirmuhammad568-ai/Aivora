function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

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

export async function listFiles() {
  const { files } = await request('/files')
  return files
}

export async function uploadFile(file) {
  const dataUrl = await readAsDataUrl(file)
  const base64 = dataUrl.split(',')[1]
  const { file: uploaded } = await request('/files', {
    method: 'POST',
    body: JSON.stringify({ name: file.name, mimeType: file.type || 'application/octet-stream', base64 }),
  })
  return uploaded
}

export function deleteFile(id) {
  return request(`/files/${id}`, { method: 'DELETE' })
}
