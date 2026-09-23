import { apiRequest } from './apiClient.js'

export async function fetchActivity() {
  const { activity } = await apiRequest('/activity')
  return activity
}
