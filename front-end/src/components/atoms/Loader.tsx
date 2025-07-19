import React from 'react'
import { cn } from '@/lib/utils'

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  color?: 'primary' | 'secondary' | 'white'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-muted-foreground',
  white: 'text-white',
}

const SpinnerLoader: React.FC<{ className: string }> = ({ className }) => (
  <div className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', className)} />
)

const DotsLoader: React.FC<{ className: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
)

const PulseLoader: React.FC<{ className: string }> = ({ className }) => (
  <div className={cn('bg-current rounded-full animate-pulse', className)} />
)

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className,
  ...props
}) => {
  const classes = cn(
    sizeClasses[size],
    colorClasses[color],
    className
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader className={classes} />
      case 'pulse':
        return <PulseLoader className={classes} />
      default:
        return <SpinnerLoader className={classes} />
    }
  }

  return (
    <div className="inline-flex items-center justify-center" {...props}>
      {renderLoader()}
    </div>
  )
}
