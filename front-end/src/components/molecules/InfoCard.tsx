import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Text } from '../atoms/Text'
import { Icon } from '../atoms/Icon'
import { cn } from '@/lib/utils'

export interface InfoCardProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  value?: string | number
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  variant?: 'default' | 'outlined' | 'filled'
  className?: string
  onClick?: () => void
}

const variantClasses = {
  default: '',
  outlined: 'border-2',
  filled: 'bg-muted/50',
}

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-muted-foreground',
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  value,
  trend,
  variant = 'default',
  className,
  onClick
}) => {
  const isClickable = !!onClick

  return (
    <Card
      className={cn(
        variantClasses[variant],
        isClickable && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Text variant="h6" color="secondary" className="text-sm font-medium">
            {title}
          </Text>
          {icon && (
            <Icon 
              icon={icon} 
              size="sm" 
              color="muted"
              className="opacity-70"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {value && (
          <div className="flex items-baseline space-x-2">
            <Text variant="h3" weight="bold" className="text-2xl">
              {value}
            </Text>
            {trend && (
              <Text 
                variant="small" 
                className={cn('font-medium', trendColors[trend.direction])}
              >
                {(() => {
                  if (trend.direction === 'up') return '+'
                  if (trend.direction === 'down') return '-'
                  return ''
                })()}
                {Math.abs(trend.value)}%
              </Text>
            )}
          </div>
        )}
        
        {description && (
          <Text variant="small" color="muted" className="mt-1">
            {description}
          </Text>
        )}
      </CardContent>
    </Card>
  )
}
