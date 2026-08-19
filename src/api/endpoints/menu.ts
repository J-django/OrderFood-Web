import { apiClient } from '../modules/client'
import type { MenuItem } from '@/types'

export async function getMenu() {
  const response = await apiClient.get<MenuItem[]>('/menu')
  return response.data
}
