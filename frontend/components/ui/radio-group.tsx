import * as React from 'react'

import { cn } from '@/lib/utils'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type="radio"
      data-slot="radio-group-item"
      className={cn(
        'radio',
        'aria-invalid:radio-error',
        className,
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
