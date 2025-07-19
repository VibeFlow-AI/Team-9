import React from 'react'
import { cn } from '@/lib/utils'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'
  align?: 'left' | 'center' | 'right' | 'justify'
  children: React.ReactNode
}

type ComponentType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small'

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

const weightClasses = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorClasses = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

export const Text: React.FC<TextProps> = ({
  variant = 'p',
  size,
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className,
  children,
  ...props
}) => {
  const classes = cn(
    weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    size && sizeClasses[size],
    className
  )

  const renderContent = () => {
    switch (variant) {
      case 'h1':
        return <h1 className={classes} {...props}>{children}</h1>
      case 'h2':
        return <h2 className={classes} {...props}>{children}</h2>
      case 'h3':
        return <h3 className={classes} {...props}>{children}</h3>
      case 'h4':
        return <h4 className={classes} {...props}>{children}</h4>
      case 'h5':
        return <h5 className={classes} {...props}>{children}</h5>
      case 'h6':
        return <h6 className={classes} {...props}>{children}</h6>
      case 'span':
        return <span className={classes} {...props}>{children}</span>
      case 'small':
        return <small className={classes} {...props}>{children}</small>
      default:
        return <p className={classes} {...props}>{children}</p>
    }
  }

  return renderContent()
}
