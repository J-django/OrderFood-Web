import { MotionConfig } from 'motion/react'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.2 }}>
        {children}
      </MotionConfig>
    </TooltipProvider>
  )
}
