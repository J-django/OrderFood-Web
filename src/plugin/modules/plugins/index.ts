import { createPlugin } from '@/plugin/utils'
import { AppProviders } from '@/providers'
import type { ReactPlugin } from '@/types'

export const Plugins: ReactPlugin[] = [createPlugin(AppProviders)]
