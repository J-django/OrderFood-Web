import { get } from '@/api/modules/methods'
import type { MenuItem } from '@/types'

export function getMenu() {
  return get<MenuItem[]>('/menu')
}
