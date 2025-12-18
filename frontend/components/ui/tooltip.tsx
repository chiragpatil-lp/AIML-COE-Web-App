'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const TooltipContext = React.createContext<{
  content: React.ReactNode
  setContent: (content: React.ReactNode) => void
} | null>(null)

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<React.ReactNode>(null)

  return (
    <TooltipContext.Provider value={{ content, setContent }}>
      {children}
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const context = React.useContext(TooltipContext)

  return (
    <div
      data-slot="tooltip-trigger"
      className={cn('tooltip', className)}
      data-tip={context?.content}
      {...props}
    >
      {children}
    </div>
  )
}

function TooltipContent({
  children,
  ...props
}: { children: React.ReactNode }) {
  const context = React.useContext(TooltipContext)

  React.useEffect(() => {
    context?.setContent(children)
  }, [children, context])

  return null
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
