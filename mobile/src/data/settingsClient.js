import { apiRequest } from './apiClient.js'

export function getNotificationPreferences() {
  return apiRequest('/settings/notifications')
}

export function updateNotificationPreferences(prefs) {
  return apiRequest('/settings/notifications', { method: 'PUT', body: JSON.stringify(prefs) })
}
