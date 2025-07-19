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
  status: 'pending' | 'confirmed' | 'completed'
  paymentSlip?: string
}

export interface AppState {
  user: User | null
  studentData: StudentData | null
  mentorData: MentorData | null
  bookedSessions: BookedSession[]
  isLoading: boolean
  error: string | null
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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

// Initial State
const initialState: AppState = {
  user: null,
  studentData: null,
  mentorData: null,
  bookedSessions: [],
  isLoading: false,
  error: null,
}

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
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
      const newSessions = [...state.bookedSessions, action.payload]
      localStorage.setItem('bookedSessions', JSON.stringify(newSessions))
      return {
        ...state,
        bookedSessions: newSessions,
      }
    }
    case 'UPDATE_BOOKED_SESSION': {
      const updatedSessions = state.bookedSessions.map(session =>
        session.id === action.payload.id
          ? { ...session, ...action.payload.updates }
          : session
      )
      localStorage.setItem('bookedSessions', JSON.stringify(updatedSessions))
      return {
        ...state,
        bookedSessions: updatedSessions,
      }
    }
    case 'SET_BOOKED_SESSIONS':
      localStorage.setItem('bookedSessions', JSON.stringify(action.payload))
      return {
        ...state,
        bookedSessions: action.payload,
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
  const { dispatch } = useAppContext()

  return {
    setUser: (user: User) => {
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'SET_USER', payload: user })
    },

    logout: () => {
      dispatch({ type: 'LOGOUT_USER' })
    },

    setStudentData: (data: StudentData) => {
      dispatch({ type: 'SET_STUDENT_DATA', payload: data })
    },

    setMentorData: (data: MentorData) => {
      dispatch({ type: 'SET_MENTOR_DATA', payload: data })
    },

    addBookedSession: (session: BookedSession) => {
      dispatch({ type: 'ADD_BOOKED_SESSION', payload: session })
    },

    updateBookedSession: (id: string, updates: Partial<BookedSession>) => {
      dispatch({ type: 'UPDATE_BOOKED_SESSION', payload: { id, updates } })
    },

    setBookedSessions: (sessions: BookedSession[]) => {
      dispatch({ type: 'SET_BOOKED_SESSIONS', payload: sessions })
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading })
    },

    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error })
    },

    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' })
    },
  }
}
