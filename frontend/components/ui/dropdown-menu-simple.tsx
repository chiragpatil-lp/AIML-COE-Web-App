'use client'

import * as React from 'react'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="dropdown">{children}</div>
}

function DropdownMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      tabIndex={0}
      role="button"
      data-slot="dropdown-menu-trigger"
      className={cn('btn', className)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      tabIndex={0}
      data-slot="dropdown-menu-content"
      className={cn('dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow', className)}
      {...props}
    >
      {children}
    </ul>
  )
}

function DropdownMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li data-slot="dropdown-menu-item" {...props}>
      <a className={className}>{children}</a>
    </li>
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<'hr'>) {
  return (
    <hr
      data-slot="dropdown-menu-separator"
      className={cn('my-1', className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  children,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li data-slot="dropdown-menu-label" {...props}>
      <span className={cn('menu-title', className)}>{children}</span>
    </li>
  )
}

function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<'li'> & { checked?: boolean }) {
  return (
    <li data-slot="dropdown-menu-checkbox-item" {...props}>
      <a className={cn('flex items-center gap-2', className)}>
        {checked && <CheckIcon className="size-4" />}
        {children}
      </a>
    </li>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
}
