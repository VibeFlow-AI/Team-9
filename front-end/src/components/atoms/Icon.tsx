import React from 'react'
import { cn } from '@/lib/utils'

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ComponentType<{ className?: string }>
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'
  variant?: 'default' | 'contained' | 'outlined'
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

const colorClasses = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
}

const variantClasses = {
  default: '',
  contained: 'p-2 rounded-md bg-primary text-primary-foreground',
  outlined: 'p-2 rounded-md border border-border',
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  color = 'primary',
  variant = 'default',
  className,
  ...props
}) => {
  const containerClasses = cn(
    'inline-flex items-center justify-center',
    variantClasses[variant],
    className
  )

  const iconClasses = cn(
    sizeClasses[size],
    colorClasses[color]
  )

  return (
    <div className={containerClasses} {...props}>
      <IconComponent className={iconClasses} />
    </div>
  )
}
