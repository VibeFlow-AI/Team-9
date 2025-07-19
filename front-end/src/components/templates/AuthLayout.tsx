import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Text } from '../atoms/Text'
import { Spacer } from '../atoms/Spacer'
import { cn } from '@/lib/utils'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
  className
}) => {
  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center p-4', className)}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Text variant="h1" weight="bold" className="text-3xl">
            VibeFlow
          </Text>
          <Text variant="h2" weight="semibold" className="text-xl">
            {title}
          </Text>
          {subtitle && (
            <Text variant="p" color="muted">
              {subtitle}
            </Text>
          )}
        </div>

        <Spacer size="md" />

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        {footer && (
          <>
            <Spacer size="md" />
            <div className="text-center">
              {footer}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
