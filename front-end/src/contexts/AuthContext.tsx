import React, { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useAppActions, useAppContext } from './AppContext'
import type { User } from './AppContext'
import axios from 'axios'

// Update API_BASE to new backend URL
const API_BASE = 'http://localhost:3000/api/v1/users';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
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
  const { setUser, logout: appLogout } = useAppActions()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!state.user?.isAuthenticated

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password })
      const { token } = res.data
      localStorage.setItem('token', token)
      // Fetch user profile
      const profileRes = await axios.get(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user = profileRes.data
      setUser({
        id: user.id,
        fullName: user.email, // No name, so use email
        email: user.email,
        role: 'student', // Add back for type compatibility
        isAuthenticated: true,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.post(`${API_BASE}/register`, { email, password })
      // Auto-login after signup
      await login(email, password)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (): void => {
    localStorage.removeItem('token')
    setUser(null)
    appLogout()
  }

  const value: AuthContextType = useMemo(() => ({
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading,
    error,
  }), [login, signup, logout, isAuthenticated, isLoading, error])

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
