import { useEffect, useCallback, useRef } from 'react'
import { useAppActions, useAppContext } from '../contexts'

/**
 * 🔥 REAL-TIME SYNC HOOK
 * Simulates real-time updates for booking data
 * Prevents conflicts and ensures data consistency
 */
export function useRealTimeSync(options?: {
  syncInterval?: number
  enableConflictDetection?: boolean
}) {
  const { syncInterval = 30000, enableConflictDetection = true } = options || {}
  const { state } = useAppContext()
  const { syncData, setError } = useAppActions()
  const lastSyncRef = useRef<number>(Date.now())

  // Simulate fetching updates from server
  const fetchUpdates = useCallback(async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate checking for conflicts
      
      if (enableConflictDetection) {
        // Check if any booked sessions have conflicts
        const conflicts = state.bookedSessions.filter(session => {
          // Simulate finding conflicts with other bookings
          const conflictingSession = state.bookedSessions.find(other => 
            other.id !== session.id &&
            other.mentor.id === session.mentor.id &&
            other.date === session.date &&
            other.time === session.time &&
            other.status !== 'cancelled'
          )
          return conflictingSession !== undefined
        })

        if (conflicts.length > 0) {
          setError(`Booking conflict detected for ${conflicts.length} session(s). Please review your bookings.`)
        }
      }

      // Update sync time
      const now = Date.now()
      syncData({ timestamp: now })
      lastSyncRef.current = now
      
    } catch (error) {
      console.error('Sync failed:', error)
      setError('Failed to sync data. Some information may be outdated.')
    }
  }, [state.bookedSessions, enableConflictDetection, syncData, setError])

  // Periodic sync
  useEffect(() => {
    const interval = setInterval(fetchUpdates, syncInterval)
    return () => clearInterval(interval)
  }, [fetchUpdates, syncInterval])

  // Manual sync trigger
  const triggerSync = useCallback(() => {
    fetchUpdates()
  }, [fetchUpdates])

  // Check if data is stale
  const isDataStale = useCallback(() => {
    const now = Date.now()
    const lastSync = state.lastSyncTime || lastSyncRef.current
    return (now - lastSync) > syncInterval * 2 // Consider stale if 2x sync interval
  }, [state.lastSyncTime, syncInterval])

  return {
    triggerSync,
    isDataStale: isDataStale(),
    lastSyncTime: state.lastSyncTime || lastSyncRef.current,
  }
}

/**
 * 🔥 BOOKING CONFLICT PREVENTION HOOK
 * Provides utilities to prevent double bookings and conflicts
 */
export function useBookingConflictPrevention() {
  const { checkSlotAvailability } = useAppActions()
  const { state } = useAppContext()

  const validateBooking = useCallback((
    mentorId: string,
    date: string,
    time: string,
    excludeSessionId?: string
  ) => {
    // Check if slot is available
    const isAvailable = checkSlotAvailability(mentorId, date, time)
    
    if (!isAvailable) {
      // Find the conflicting session for better error message
      const conflictingSession = state.bookedSessions.find(session =>
        session.id !== excludeSessionId &&
        session.mentor.id === mentorId &&
        session.date === date &&
        session.time === time &&
        session.status !== 'cancelled'
      )

      return {
        isValid: false,
        error: conflictingSession 
          ? `This time slot is already booked (Session #${conflictingSession.id})`
          : 'This time slot is no longer available',
        conflictingSession,
      }
    }

    // Additional validations
    const bookingDate = new Date(`${date}T${time}:00`)
    const now = new Date()

    if (bookingDate <= now) {
      return {
        isValid: false,
        error: 'Cannot book sessions in the past',
      }
    }

    // Check if too close to current time (e.g., less than 2 hours)
    const timeDiff = bookingDate.getTime() - now.getTime()
    const twoHours = 2 * 60 * 60 * 1000
    
    if (timeDiff < twoHours) {
      return {
        isValid: false,
        error: 'Sessions must be booked at least 2 hours in advance',
      }
    }

    return {
      isValid: true,
      error: null,
    }
  }, [checkSlotAvailability, state.bookedSessions])

  const getAvailableSlots = useCallback((mentorId: string, date: string) => {
    const allSlots = [
      '09:00', '11:00', '14:00', '16:00', '18:00', '20:00'
    ]

    const bookedSlots = state.bookedSessions
      .filter(session => 
        session.mentor.id === mentorId &&
        session.date === date &&
        session.status !== 'cancelled'
      )
      .map(session => session.time)

    return allSlots.filter(slot => !bookedSlots.includes(slot))
  }, [state.bookedSessions])

  return {
    validateBooking,
    getAvailableSlots,
  }
}
