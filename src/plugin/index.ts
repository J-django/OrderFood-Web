import { Plugins } from './modules/plugins'
import './modules/styles'
import { composePlugins } from './utils'
import type { ReactNode } from 'react'

export function registerPlugins(children: ReactNode): ReactNode {
  return composePlugins(Plugins, children)
}
