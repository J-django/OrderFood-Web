import { MotionConfig } from 'motion/react'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toast'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.2 }}>
        {children}
        <Toaster />
      </MotionConfig>
    </TooltipProvider>
  )
}
