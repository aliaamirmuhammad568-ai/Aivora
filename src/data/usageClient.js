export async function fetchUsage() {
  const res = await fetch('/api/usage', { credentials: 'include' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Could not load usage data.')
  }
  return data // { messagesUsed, tokensUsed, monthly: [{month, value}] }
}
