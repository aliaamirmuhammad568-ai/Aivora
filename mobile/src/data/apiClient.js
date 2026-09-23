export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://aivora-1qva.onrender.com'

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
  return data
}
