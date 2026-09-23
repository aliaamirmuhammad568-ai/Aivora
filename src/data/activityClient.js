export async function fetchActivity() {
  const res = await fetch('/api/activity', { credentials: 'include' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not load activity.')
  return data.activity
}
