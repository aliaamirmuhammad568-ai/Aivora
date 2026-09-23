import { apiRequest, API_URL } from './apiClient.js'

function postAuth(path, body) {
  return apiRequest(`/auth/${path}`, { method: 'POST', body: JSON.stringify(body) })
}

export function signup({ name, email, password }) {
  return postAuth('signup', { name, email, password }).then((d) => d.user)
}

// Returns { user } on success, or { requiresTwoFactor: true, tempToken }
export function login({ email, password, remember }) {
  return postAuth('login', { email, password, remember })
}

export function verifyTwoFactorLogin({ tempToken, code }) {
  return postAuth('2fa/login-verify', { tempToken, code }).then((d) => d.user)
}

export function forgotPassword({ email }) {
  return postAuth('forgot-password', { email })
}

export function resetPassword({ token, password }) {
  return postAuth('reset-password', { token, password })
}

export function changePassword({ currentPassword, newPassword }) {
  return postAuth('change-password', { currentPassword, newPassword })
}

export function setupTwoFactor() {
  return postAuth('2fa/setup', {})
}

export function confirmTwoFactor(code) {
  return postAuth('2fa/confirm', { code })
}

export function disableTwoFactor(payload) {
  return postAuth('2fa/disable', payload)
}

export function fetchMe() {
  return apiRequest('/auth/me')
}

export function logout() {
  return postAuth('logout', {})
}

export function fetchProviders() {
  return apiRequest('/auth/providers')
}

export function oauthUrl(provider) {
  return `${API_URL}/api/auth/${provider}`
}
