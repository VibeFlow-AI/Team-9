import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../atoms'
import { Text } from '../atoms/Text'
import { ActionButton } from '../molecules/ActionButton'
import { UserAvatar } from '../molecules/UserAvatar'
import { Calendar, Clock, MapPin, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Session {
  id: string
  title: string
  description?: string
  date: string
  time: string
  duration: number // in minutes
  location?: string
  isOnline: boolean
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled'
  mentor?: {
    name: string
    avatar?: string
    expertise: string[]
  }
  student?: {
    name: string
    avatar?: string
    level: string
  }
}

export interface SessionListProps {
  sessions: Session[]
  userRole: 'student' | 'mentor'
  onSessionClick?: (session: Session) => void
  onJoinSession?: (sessionId: string) => void
  onCancelSession?: (sessionId: string) => void
  className?: string
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels = {
  scheduled: 'Scheduled',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  userRole,
  onSessionClick,
  onJoinSession,
  onCancelSession,
  className
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const canJoinSession = (session: Session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`)
    const now = new Date()
    const timeDiff = sessionDateTime.getTime() - now.getTime()
    const minutesDiff = timeDiff / (1000 * 60)
    
    return session.status === 'scheduled' && minutesDiff <= 15 && minutesDiff >= -session.duration
  }

  const canCancelSession = (session: Session) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}`)
    const now = new Date()
    const hoursDiff = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return session.status === 'scheduled' && hoursDiff > 24
  }

  if (sessions.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Text variant="p" color="muted" align="center">
            No sessions found. {userRole === 'student' ? 'Book your first session!' : 'Your schedule is clear.'}
          </Text>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {sessions.map((session) => (
        <Card 
          key={session.id} 
          className={cn(
            'transition-shadow',
            onSessionClick && 'cursor-pointer hover:shadow-md'
          )}
          onClick={onSessionClick ? () => onSessionClick(session) : undefined}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{session.title}</CardTitle>
                {session.description && (
                  <Text variant="p" color="muted" className="text-sm">
                    {session.description}
                  </Text>
                )}
              </div>
              <Badge 
                variant="secondary" 
                className={statusColors[session.status]}
              >
                {statusLabels[session.status]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Session Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Text variant="span" color="muted">
                    {formatDate(session.date)}
                  </Text>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Text variant="span" color="muted">
                    {formatTime(session.time)} ({session.duration}m)
                  </Text>
                </div>
                
                <div className="flex items-center space-x-2">
                  {session.isOnline ? (
                    <Video className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Text variant="span" color="muted">
                    {session.isOnline ? 'Online' : session.location || 'Location TBD'}
                  </Text>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {userRole === 'student' && session.mentor && (
                    <div className="flex items-center space-x-2">
                      <Text variant="small" color="muted">Mentor:</Text>
                      <UserAvatar
                        name={session.mentor.name}
                        avatar={session.mentor.avatar}
                        role={session.mentor.expertise[0]}
                        size="sm"
                        showDetails={true}
                      />
                    </div>
                  )}
                  
                  {userRole === 'mentor' && session.student && (
                    <div className="flex items-center space-x-2">
                      <Text variant="small" color="muted">Student:</Text>
                      <UserAvatar
                        name={session.student.name}
                        avatar={session.student.avatar}
                        role={session.student.level}
                        size="sm"
                        showDetails={true}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {canJoinSession(session) && onJoinSession && (
                    <ActionButton
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onJoinSession(session.id)
                      }}
                    >
                      Join
                    </ActionButton>
                  )}
                  
                  {canCancelSession(session) && onCancelSession && (
                    <ActionButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCancelSession(session.id)
                      }}
                    >
                      Cancel
                    </ActionButton>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
