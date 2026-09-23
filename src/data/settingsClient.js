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

export function getNotificationPreferences() {
  return request('/settings/notifications')
}

export function updateNotificationPreferences(prefs) {
  return request('/settings/notifications', { method: 'PUT', body: JSON.stringify(prefs) })
}
