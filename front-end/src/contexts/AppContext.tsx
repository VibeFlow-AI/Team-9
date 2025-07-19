import React, { createContext, useContext, useReducer, useMemo } from 'react'
import type { ReactNode } from 'react'

// Types
export interface User {
  id: string
  fullName: string
  email: string
  role: 'student' | 'mentor'
  profilePicture?: string
  isAuthenticated: boolean
}

export interface StudentData {
  fullName: string
  email: string
  grade: string
  subjectsOfInterest: string
  learningGoals: string
  availability: string[]
  learningStyle: string
}

export interface MentorData {
  fullName: string
  email: string
  phone: string
  experience: string
  education: string
  subjects: string[]
  qualifications: string[]
  availability: string[]
  hourlyRate: string
  bio: string
  profileImage?: File | null
}

export interface BookedSession {
  id: string
  mentor: any
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentSlip?: string
  createdAt: string
  updatedAt: string
}

export interface MentorAvailability {
  mentorId: string
  date: string
  timeSlots: string[]
  bookedSlots: string[]
}

export interface AppState {
  user: User | null
  studentData: StudentData | null
  mentorData: MentorData | null
  bookedSessions: BookedSession[]
  mentorAvailability: MentorAvailability[]
  isLoading: boolean
  error: string | null
  lastSyncTime: number | null
}

// Action Types
export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT_USER' }
  | { type: 'SET_STUDENT_DATA'; payload: StudentData }
  | { type: 'SET_MENTOR_DATA'; payload: MentorData }
  | { type: 'ADD_BOOKED_SESSION'; payload: BookedSession }
  | { type: 'UPDATE_BOOKED_SESSION'; payload: { id: string; updates: Partial<BookedSession> } }
  | { type: 'SET_BOOKED_SESSIONS'; payload: BookedSession[] }
  | { type: 'UPDATE_MENTOR_AVAILABILITY'; payload: MentorAvailability }
  | { type: 'SET_MENTOR_AVAILABILITY'; payload: MentorAvailability[] }
  | { type: 'SYNC_DATA'; payload: { timestamp: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

// Initial State
const initialState: AppState = {
  user: null,
  studentData: null,
  mentorData: null,
  bookedSessions: [],
  mentorAvailability: [],
  isLoading: false,
  error: null,
  lastSyncTime: null,
}

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload))
      } else {
        localStorage.removeItem('user')
      }
      return {
        ...state,
        user: action.payload,
        error: null,
      }
    case 'LOGOUT_USER':
      // Clear all user-related data on logout
      localStorage.removeItem('user')
      localStorage.removeItem('studentData')
      localStorage.removeItem('mentorData')
      localStorage.removeItem('bookedSessions')
      localStorage.removeItem('mentorAvailability')
      localStorage.removeItem('studentOnboardingData')
      localStorage.removeItem('studentOnboardingStep')
      localStorage.removeItem('mentorOnboardingData')
      localStorage.removeItem('mentorOnboardingStep')
      return {
        ...initialState,
      }
    case 'SET_STUDENT_DATA':
      localStorage.setItem('studentData', JSON.stringify(action.payload))
      return {
        ...state,
        studentData: action.payload,
      }
    case 'SET_MENTOR_DATA':
      localStorage.setItem('mentorData', JSON.stringify(action.payload))
      return {
        ...state,
        mentorData: action.payload,
      }
    case 'ADD_BOOKED_SESSION': {
      // 🔥 CONFLICT PREVENTION: Check if slot is already booked
      const existingBooking = state.bookedSessions.find(session => 
        session.mentor.id === action.payload.mentor.id &&
        session.date === action.payload.date &&
        session.time === action.payload.time &&
        session.status !== 'cancelled'
      )
      
      if (existingBooking) {
        throw new Error('This time slot is already booked. Please choose another time.')
      }
      
      const newSession = {
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const newSessions = [...state.bookedSessions, newSession]
      localStorage.setItem('bookedSessions', JSON.stringify(newSessions))
      
      // 🔥 REAL-TIME UPDATE: Update mentor availability
      const updatedAvailability = state.mentorAvailability.map(avail => 
        avail.mentorId === action.payload.mentor.id && avail.date === action.payload.date
          ? {
              ...avail,
              bookedSlots: [...avail.bookedSlots, action.payload.time]
            }
          : avail
      )
      
      localStorage.setItem('mentorAvailability', JSON.stringify(updatedAvailability))
      
      return {
        ...state,
        bookedSessions: newSessions,
        mentorAvailability: updatedAvailability,
        lastSyncTime: Date.now(),
      }
    }
    case 'UPDATE_BOOKED_SESSION': {
      const updatedSessions = state.bookedSessions.map(session =>
        session.id === action.payload.id
          ? { 
              ...session, 
              ...action.payload.updates,
              updatedAt: new Date().toISOString()
            }
          : session
      )
      localStorage.setItem('bookedSessions', JSON.stringify(updatedSessions))
      return {
        ...state,
        bookedSessions: updatedSessions,
        lastSyncTime: Date.now(),
      }
    }
    case 'SET_BOOKED_SESSIONS':
      localStorage.setItem('bookedSessions', JSON.stringify(action.payload))
      return {
        ...state,
        bookedSessions: action.payload,
        lastSyncTime: Date.now(),
      }
    case 'UPDATE_MENTOR_AVAILABILITY': {
      const updatedAvailability = state.mentorAvailability.find(
        avail => avail.mentorId === action.payload.mentorId && avail.date === action.payload.date
      )
        ? state.mentorAvailability.map(avail =>
            avail.mentorId === action.payload.mentorId && avail.date === action.payload.date
              ? action.payload
              : avail
          )
        : [...state.mentorAvailability, action.payload]
      
      localStorage.setItem('mentorAvailability', JSON.stringify(updatedAvailability))
      return {
        ...state,
        mentorAvailability: updatedAvailability,
        lastSyncTime: Date.now(),
      }
    }
    case 'SET_MENTOR_AVAILABILITY':
      localStorage.setItem('mentorAvailability', JSON.stringify(action.payload))
      return {
        ...state,
        mentorAvailability: action.payload,
        lastSyncTime: Date.now(),
      }
    case 'SYNC_DATA':
      return {
        ...state,
        lastSyncTime: action.payload.timestamp,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

// Provider Component
interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load initial data from localStorage on mount
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedStudentData = localStorage.getItem('studentData')
      const savedMentorData = localStorage.getItem('mentorData')
      const savedBookedSessions = localStorage.getItem('bookedSessions')
      const savedMentorAvailability = localStorage.getItem('mentorAvailability')

      if (savedUser) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) })
      }

      if (savedStudentData) {
        dispatch({ type: 'SET_STUDENT_DATA', payload: JSON.parse(savedStudentData) })
      }

      if (savedMentorData) {
        dispatch({ type: 'SET_MENTOR_DATA', payload: JSON.parse(savedMentorData) })
      }

      if (savedBookedSessions) {
        dispatch({ type: 'SET_BOOKED_SESSIONS', payload: JSON.parse(savedBookedSessions) })
      }

      if (savedMentorAvailability) {
        dispatch({ type: 'SET_MENTOR_AVAILABILITY', payload: JSON.parse(savedMentorAvailability) })
      }

      // Set initial sync time
      dispatch({ type: 'SYNC_DATA', payload: { timestamp: Date.now() } })
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' })
    }
  }, [])

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

// Action Creators (Helper functions)
export const useAppActions = () => {
  const { dispatch } = useAppContext();

  return useMemo(() => ({
    setUser: (payload: User | null) => dispatch({ type: 'SET_USER', payload }),
    logoutUser: () => dispatch({ type: 'LOGOUT_USER' }),
    setStudentData: (payload: StudentData) => dispatch({ type: 'SET_STUDENT_DATA', payload }),
    setMentorData: (payload: MentorData) => dispatch({ type: 'SET_MENTOR_DATA', payload }),
    addBookedSession: (payload: BookedSession) => dispatch({ type: 'ADD_BOOKED_SESSION', payload }),
    updateBookedSession: (payload: { id: string; updates: Partial<BookedSession> }) =>
      dispatch({ type: 'UPDATE_BOOKED_SESSION', payload }),
    setBookedSessions: (payload: BookedSession[]) => dispatch({ type: 'SET_BOOKED_SESSIONS', payload }),
    updateMentorAvailability: (payload: MentorAvailability) =>
      dispatch({ type: 'UPDATE_MENTOR_AVAILABILITY', payload }),
    setMentorAvailability: (payload: MentorAvailability[]) =>
      dispatch({ type: 'SET_MENTOR_AVAILABILITY', payload }),
    syncData: (payload: { timestamp: number }) => dispatch({ type: 'SYNC_DATA', payload }),
    setLoading: (payload: boolean) => dispatch({ type: 'SET_LOADING', payload }),
    setError: (payload: string | null) => dispatch({ type: 'SET_ERROR', payload }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  }), [dispatch]);
};
