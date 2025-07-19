import React from 'react'
import { cn } from '@/lib/utils'

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  axis?: 'horizontal' | 'vertical' | 'both'
  className?: string
}

const sizeClasses = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  axis = 'both',
  className
}) => {
  const spacing = sizeClasses[size]
  
  const style: React.CSSProperties = {}
  
  if (axis === 'horizontal' || axis === 'both') {
    style.width = spacing
  }
  
  if (axis === 'vertical' || axis === 'both') {
    style.height = spacing
  }

  return (
    <div
      className={cn('shrink-0', className)}
      style={style}
      aria-hidden="true"
    />
  )
}
