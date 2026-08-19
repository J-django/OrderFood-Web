import { apiClient } from './modules/client'

export * from './endpoints/menu'
export { apiClient }

export function initializeApiClient() {
  apiClient.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}
