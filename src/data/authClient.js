async function postAuth(path, body) {
  const res = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
  return data
}

export function signup({ name, email, password }) {
  return postAuth('signup', { name, email, password }).then((d) => d.user)
}

// Returns either { user } on success, or { requiresTwoFactor: true, tempToken }
// if the account has 2FA enabled — the caller then shows a code prompt and
// calls verifyTwoFactorLogin.
export function login({ email, password, remember }) {
  return postAuth('login', { email, password, remember })
}

export function verifyTwoFactorLogin({ tempToken, code }) {
  return postAuth('2fa/login-verify', { tempToken, code }).then((d) => d.user)
}

export async function forgotPassword({ email }) {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data // { ok: true, devResetLink? }
}

export async function resetPassword({ token, password }) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export function changePassword({ currentPassword, newPassword }) {
  return postAuth('change-password', { currentPassword, newPassword })
}

export function setupTwoFactor() {
  return postAuth('2fa/setup', {}) // { secret, qrCode }
}

export function confirmTwoFactor(code) {
  return postAuth('2fa/confirm', { code })
}

export function disableTwoFactor({ password, code }) {
  return postAuth('2fa/disable', { password, code })
}
