import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/templates/AppLayout'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import type { NavigationItem } from '@/components/organisms/Header'
import type { DashboardStats } from '@/components/organisms/DashboardMetrics'
import type { Session } from '@/components/organisms/SessionList'
import { ActionButton } from '@/components/molecules/ActionButton'
import { Text } from '@/components/atoms/Text'
import { Plus, Calendar, Users, BookOpen } from 'lucide-react'

// Mock data - replace with actual API calls
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  role: 'Student'
}

const mockStats: DashboardStats = {
  totalSessions: 12,
  upcomingSessions: 3,
  completedSessions: 8,
  pendingSessions: 1
}

const mockUpcomingSessions: Session[] = [
  {
    id: '1',
    title: 'React Advanced Patterns',
    description: 'Deep dive into advanced React patterns and hooks',
    date: '2025-07-22',
    time: '14:00',
    duration: 60,
    isOnline: true,
    status: 'scheduled',
    mentor: {
      name: 'Sarah Johnson',
      avatar: '',
      expertise: ['React', 'Frontend Development']
    }
  },
  {
    id: '2',
    title: 'Career Guidance Session',
    description: 'Discussion about career paths in tech',
    date: '2025-07-24',
    time: '10:00',
    duration: 45,
    isOnline: true,
    status: 'scheduled',
    mentor: {
      name: 'Mike Chen',
      avatar: '',
      expertise: ['Career Development', 'Tech Leadership']
    }
  }
]

const mockRecentSessions: Session[] = [
  {
    id: '3',
    title: 'JavaScript Fundamentals',
    description: 'Covering ES6+ features and best practices',
    date: '2025-07-15',
    time: '16:00',
    duration: 60,
    isOnline: true,
    status: 'completed',
    mentor: {
      name: 'Alex Rivera',
      avatar: '',
      expertise: ['JavaScript', 'Web Development']
    }
  }
]

const navigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', active: true, icon: BookOpen },
  { label: 'Sessions', href: '/student/sessions', icon: Calendar },
  { label: 'Mentors', href: '/student/mentors', icon: Users }
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load dashboard data on component mount
    // This would typically fetch from your API
  }, [])

  const handleLogout = () => {
    // Implement logout logic
    navigate('/auth/login')
  }

  const handleProfile = () => {
    navigate('/student/profile')
  }

  const handleSettings = () => {
    navigate('/student/settings')
  }

  const handleMetricClick = (metric: keyof DashboardStats) => {
    // Navigate to filtered sessions view
    navigate(`/student/sessions?filter=${String(metric)}`)
  }

  const handleSessionClick = (session: Session) => {
    navigate(`/student/sessions/${session.id}`)
  }

  const handleJoinSession = (sessionId: string) => {
    navigate(`/student/sessions/${sessionId}/join`)
  }

  const handleCancelSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to cancel this session?')) {
      setLoading(true)
      try {
        // API call to cancel session
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Refresh data after cancellation
      } catch (error) {
        console.error('Failed to cancel session:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBookNewSession = () => {
    navigate('/student/book-session')
  }

  const additionalContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Text variant="h3" weight="semibold">
          Quick Actions
        </Text>
        <ActionButton
          icon={Plus}
          onClick={handleBookNewSession}
          disabled={loading}
        >
          Book New Session
        </ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionButton
          variant="outline"
          onClick={() => navigate('/student/mentors')}
          className="h-20 flex-col space-y-2"
        >
          <Users className="w-6 h-6" />
          <span>Browse Mentors</span>
        </ActionButton>

        <ActionButton
          variant="outline"
          onClick={() => navigate('/student/sessions')}
          className="h-20 flex-col space-y-2"
        >
          <Calendar className="w-6 h-6" />
          <span>View All Sessions</span>
        </ActionButton>

        <ActionButton
          variant="outline"
          onClick={() => navigate('/student/profile')}
          className="h-20 flex-col space-y-2"
        >
          <BookOpen className="w-6 h-6" />
          <span>Update Profile</span>
        </ActionButton>
      </div>
    </div>
  )

  return (
    <AppLayout
      title="VibeFlow"
      user={mockUser}
      navigation={navigation}
      onLogout={handleLogout}
      onProfile={handleProfile}
      onSettings={handleSettings}
    >
      <DashboardLayout
        userRole="student"
        stats={mockStats}
        recentSessions={mockRecentSessions}
        upcomingSessions={mockUpcomingSessions}
        onMetricClick={handleMetricClick}
        onSessionClick={handleSessionClick}
        onJoinSession={handleJoinSession}
        onCancelSession={handleCancelSession}
        additionalContent={additionalContent}
      />
    </AppLayout>
  )
}
