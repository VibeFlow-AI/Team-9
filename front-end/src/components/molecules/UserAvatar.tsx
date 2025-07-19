import React from 'react'
import { Avatar, Badge } from '../atoms'
import { Text } from '../atoms/Text'
import { cn } from '@/lib/utils'

export interface UserAvatarProps {
  name: string
  email?: string
  avatar?: string
  role?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  className?: string
  onClick?: () => void
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  avatar,
  role,
  status,
  size = 'md',
  showDetails = false,
  className,
  onClick
}) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isClickable = !!onClick

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick()
    }
  }

  const WrapperComponent = isClickable ? 'button' : 'div'

  return (
    <WrapperComponent
      className={cn(
        'flex items-center space-x-3 bg-transparent border-none p-0 text-left',
        isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
    >
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          )}
        </Avatar>
        
        {status && (
          <div
            className={cn(
              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
              statusColors[status]
            )}
          />
        )}
      </div>

      {showDetails && (
        <div className="flex-1 min-w-0">
          <Text variant="p" weight="medium" className="truncate">
            {name}
          </Text>
          {email && (
            <Text variant="small" color="muted" className="truncate">
              {email}
            </Text>
          )}
          {role && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {role}
            </Badge>
          )}
        </div>
      )}
    </WrapperComponent>
  )
}
