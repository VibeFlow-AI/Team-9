import React from 'react'
import { InfoCard } from '../molecules/InfoCard'
import { Text } from '../atoms/Text'
import { Spacer } from '../atoms/Spacer'
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react'

export interface DashboardStats {
  totalSessions: number
  upcomingSessions: number
  completedSessions: number
  pendingSessions: number
}

export interface DashboardMetricsProps {
  stats: DashboardStats
  userRole: 'student' | 'mentor'
  onCardClick?: (metric: keyof DashboardStats) => void
  className?: string
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  stats,
  userRole,
  onCardClick,
  className
}) => {
  const getMetricTitle = (metric: keyof DashboardStats) => {
    const titles = {
      student: {
        totalSessions: 'Total Sessions',
        upcomingSessions: 'Upcoming Sessions',
        completedSessions: 'Completed Sessions',
        pendingSessions: 'Pending Sessions'
      },
      mentor: {
        totalSessions: 'Total Sessions',
        upcomingSessions: 'Upcoming Sessions',
        completedSessions: 'Completed Sessions',
        pendingSessions: 'Pending Approvals'
      }
    }
    return titles[userRole][metric]
  }

  const getMetricDescription = (metric: keyof DashboardStats) => {
    const descriptions = {
      student: {
        totalSessions: 'All your mentoring sessions',
        upcomingSessions: 'Sessions scheduled soon',
        completedSessions: 'Successfully completed sessions',
        pendingSessions: 'Awaiting mentor approval'
      },
      mentor: {
        totalSessions: 'All your mentoring sessions',
        upcomingSessions: 'Sessions scheduled soon',
        completedSessions: 'Successfully completed sessions',
        pendingSessions: 'Student requests to review'
      }
    }
    return descriptions[userRole][metric]
  }

  const metrics = [
    {
      key: 'totalSessions' as const,
      icon: Users,
      value: stats.totalSessions,
      variant: 'default' as const
    },
    {
      key: 'upcomingSessions' as const,
      icon: Calendar,
      value: stats.upcomingSessions,
      variant: 'outlined' as const
    },
    {
      key: 'completedSessions' as const,
      icon: CheckCircle,
      value: stats.completedSessions,
      variant: 'filled' as const
    },
    {
      key: 'pendingSessions' as const,
      icon: Clock,
      value: stats.pendingSessions,
      variant: 'outlined' as const
    }
  ]

  return (
    <div className={className}>
      <Text variant="h3" weight="semibold" className="mb-6">
        Dashboard Overview
      </Text>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <InfoCard
            key={metric.key}
            title={getMetricTitle(metric.key)}
            description={getMetricDescription(metric.key)}
            icon={metric.icon}
            value={metric.value}
            variant={metric.variant}
            onClick={onCardClick ? () => onCardClick(metric.key) : undefined}
            className="hover:shadow-lg transition-shadow"
          />
        ))}
      </div>
      
      <Spacer size="xl" />
    </div>
  )
}
