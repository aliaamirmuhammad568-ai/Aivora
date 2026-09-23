import { apiRequest } from './apiClient.js'

export function fetchUsage() {
  return apiRequest('/usage')
}
