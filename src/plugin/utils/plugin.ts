import { createElement } from 'react'
import type { ComponentType, PropsWithChildren, ReactNode } from 'react'
import type { ReactPlugin } from '@/types'

export function createPlugin<P extends object>(
  Provider: ComponentType<PropsWithChildren<P>>,
  options?: P,
): ReactPlugin {
  const WrappedPlugin = ({ children }: PropsWithChildren) =>
    createElement(Provider, options ?? ({} as P), children)

  WrappedPlugin.displayName = `ReactPlugin(${Provider.displayName || Provider.name || 'Anonymous'})`

  return WrappedPlugin
}

export function composePlugins(
  plugins: ReactPlugin[],
  children: ReactNode,
): ReactNode {
  return plugins.reduceRight<ReactNode>(
    (currentChildren, Plugin) => createElement(Plugin, null, currentChildren),
    children,
  )
}
