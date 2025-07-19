import React from 'react'
import { Button } from '../atoms'
import { Icon } from '../atoms/Icon'
import { Text } from '../atoms/Text'
import { cn } from '@/lib/utils'

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  loading?: boolean
  children: React.ReactNode
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  loading = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading
  
  const getIconSize = () => {
    if (size === 'sm') return 'sm'
    if (size === 'lg') return 'md'
    return 'sm'
  }
  
  const getButtonSize = () => {
    if (size === 'md') return 'default'
    return size
  }

  return (
    <Button
      variant={variant}
      size={getButtonSize() as "default" | "sm" | "lg" | "icon"}
      disabled={isDisabled}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon 
          icon={icon} 
          size={getIconSize()}
        />
      )}
      
      <Text variant="span" className="flex-1">
        {children}
      </Text>
      
      {icon && iconPosition === 'right' && (
        <Icon 
          icon={icon} 
          size={getIconSize()}
        />
      )}
    </Button>
  )
}
