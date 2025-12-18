'use client'

import * as React from 'react'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const SheetContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
  side: 'top' | 'right' | 'bottom' | 'left'
} | null>(null)

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : uncontrolledOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setUncontrolledOpen

  return (
    <SheetContext.Provider value={{ open: isOpen, onOpenChange: setOpen, side: 'right' }}>
      <div className="drawer drawer-end">
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={(e) => setOpen(e.target.checked)}
        />
        {children}
      </div>
    </SheetContext.Provider>
  )
}

function SheetTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'label'>) {
  return (
    <label
      htmlFor="my-drawer"
      data-slot="sheet-trigger"
      className={cn('drawer-button', className)}
      {...props}
    >
      {children}
    </label>
  )
}

function SheetClose({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const context = React.useContext(SheetContext)

  return (
    <button
      data-slot="sheet-close"
      type="button"
      className={className}
      onClick={() => context?.onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  )
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SheetOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-overlay" className={className} {...props} />
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const context = React.useContext(SheetContext)

  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        className="drawer-overlay"
        onClick={() => context?.onOpenChange(false)}
      />
      <div
        data-slot="sheet-content"
        className={cn('menu bg-base-100 min-h-full w-80 p-4', className)}
        {...props}
      >
        {children}
        <button
          data-slot="sheet-close"
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => context?.onOpenChange(false)}
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-2 mb-4', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('flex flex-col gap-2 mt-auto', className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn('text-lg font-bold', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="sheet-description"
      className={cn('text-sm opacity-70', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
