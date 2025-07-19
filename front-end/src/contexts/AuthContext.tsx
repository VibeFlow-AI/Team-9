import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useAppActions, useAppContext } from './AppContext'
import type { User } from './AppContext'

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string, role: 'student' | 'mentor') => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { state } = useAppContext()
  const { setUser, logout: logoutUser, setError } = useAppActions()
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = !!state.user?.isAuthenticated

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: '1',
        fullName: 'John Doe',
        email: email,
        role: 'student',
        isAuthenticated: true,
      }
      
      setUser(mockUser)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'student' | 'mentor'
  ): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: Date.now().toString(),
        fullName: fullName,
        email: email,
        role: role,
        isAuthenticated: true,
      }
      
      setUser(mockUser)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Implement Google OAuth
      // This is a placeholder implementation
      console.log('Google login initiated...')
      
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock Google user data
      const mockUser: User = {
        id: 'google_' + Date.now(),
        fullName: 'Google User',
        email: 'user@gmail.com',
        role: 'student',
        isAuthenticated: true,
        profilePicture: 'https://via.placeholder.com/40'
      }
      
      setUser(mockUser)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGitHub = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Implement GitHub OAuth
      // This is a placeholder implementation
      console.log('GitHub login initiated...')
      
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock GitHub user data
      const mockUser: User = {
        id: 'github_' + Date.now(),
        fullName: 'GitHub User',
        email: 'user@github.com',
        role: 'student',
        isAuthenticated: true,
        profilePicture: 'https://via.placeholder.com/40'
      }
      
      setUser(mockUser)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'GitHub login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (): void => {
    logoutUser()
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // TODO: Check for existing session with backend
        // For now, we rely on localStorage data loaded by AppProvider
        console.log('Checking existing session...')
      } catch (error) {
        console.error('Session check failed:', error)
      }
    }

    checkExistingSession()
  }, [])

  const value: AuthContextType = useMemo(() => ({
    login,
    signup,
    loginWithGoogle,
    loginWithGitHub,
    logout,
    isAuthenticated,
    isLoading,
    error: state.error,
  }), [login, signup, loginWithGoogle, loginWithGitHub, logout, isAuthenticated, isLoading, state.error])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
