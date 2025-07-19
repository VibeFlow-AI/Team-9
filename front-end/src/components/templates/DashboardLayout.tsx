import React from 'react'
import { DashboardMetrics } from '../organisms/DashboardMetrics'
import { SessionList } from '../organisms/SessionList'
import type { DashboardStats } from '../organisms/DashboardMetrics'
import type { Session } from '../organisms/SessionList'
import { Text } from '../atoms/Text'
import { Spacer } from '../atoms/Spacer'
import { cn } from '@/lib/utils'

export interface DashboardLayoutProps {
  userRole: 'student' | 'mentor'
  stats: DashboardStats
  recentSessions: Session[]
  upcomingSessions: Session[]
  onMetricClick?: (metric: keyof DashboardStats) => void
  onSessionClick?: (session: Session) => void
  onJoinSession?: (sessionId: string) => void
  onCancelSession?: (sessionId: string) => void
  additionalContent?: React.ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  userRole,
  stats,
  recentSessions,
  upcomingSessions,
  onMetricClick,
  onSessionClick,
  onJoinSession,
  onCancelSession,
  additionalContent,
  className
}) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Dashboard Metrics */}
      <DashboardMetrics
        stats={stats}
        userRole={userRole}
        onCardClick={onMetricClick}
      />

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <section>
          <Text variant="h3" weight="semibold" className="mb-4">
            Upcoming Sessions
          </Text>
          <SessionList
            sessions={upcomingSessions}
            userRole={userRole}
            onSessionClick={onSessionClick}
            onJoinSession={onJoinSession}
            onCancelSession={onCancelSession}
          />
        </section>
      )}

      <Spacer size="lg" />

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <section>
          <Text variant="h3" weight="semibold" className="mb-4">
            Recent Sessions
          </Text>
          <SessionList
            sessions={recentSessions}
            userRole={userRole}
            onSessionClick={onSessionClick}
            onJoinSession={onJoinSession}
            onCancelSession={onCancelSession}
          />
        </section>
      )}

      {/* Additional Content */}
      {additionalContent && (
        <>
          <Spacer size="lg" />
          {additionalContent}
        </>
      )}
    </div>
  )
}
