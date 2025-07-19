import React from 'react'
import { Header } from '../organisms/Header'
import type { NavigationItem } from '../organisms/Header'
import { cn } from '@/lib/utils'

export interface AppLayoutProps {
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
  children: React.ReactNode
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  user,
  navigation,
  onLogout,
  onProfile,
  onSettings,
  children,
  className
}) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <Header
        title={title}
        user={user}
        navigation={navigation}
        onLogout={onLogout}
        onProfile={onProfile}
        onSettings={onSettings}
      />
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
