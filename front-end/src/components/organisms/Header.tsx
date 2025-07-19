import React from 'react'
import { Text } from '../atoms/Text'
import { UserAvatar } from '../molecules/UserAvatar'
import { ActionButton } from '../molecules/ActionButton'
import { LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
}

export interface HeaderProps {
  title?: string
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
  navigation?: NavigationItem[]
  onLogout?: () => void
  onProfile?: () => void
  onSettings?: () => void
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  user,
  navigation = [],
  onLogout,
  onProfile,
  onSettings,
  className
}) => {
  return (
    <header className={cn('border-b bg-background px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        {/* Left side - Title/Logo */}
        <div className="flex items-center space-x-4">
          {title && (
            <Text variant="h2" weight="bold" className="text-xl">
              {title}
            </Text>
          )}
          
          {/* Navigation */}
          {navigation.length > 0 && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </div>
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Right side - User actions */}
        {user && (
          <div className="flex items-center space-x-4">
            <UserAvatar
              name={user.name}
              email={user.email}
              avatar={user.avatar}
              role={user.role}
              showDetails={true}
              size="md"
              onClick={onProfile}
            />
            
            <div className="flex items-center space-x-2">
              {onSettings && (
                <ActionButton
                  variant="ghost"
                  size="sm"
                  icon={Settings}
                  onClick={onSettings}
                >
                  Settings
                </ActionButton>
              )}
              
              {onLogout && (
                <ActionButton
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={onLogout}
                >
                  Logout
                </ActionButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
