import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useAppActions, useAppContext } from './AppContext'
import type { User } from './AppContext'
import { authClient } from '../lib/auth-client'

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
  const { setUser, logoutUser, setError } = useAppActions()
  const [isLoading, setIsLoading] = useState(false)

  const { data: session, isPending } = authClient.useSession()

  const isAuthenticated = !!session?.user

  useEffect(() => {
    if (session?.user) {
      // Map Better Auth user to your User type
      setUser({
        id: session.user.id,
        fullName: session.user.name || '',
        email: session.user.email,
        role: 'student', // Default to 'student' as role is not in Better Auth user
        profilePicture: session.user.image,
        isAuthenticated: true,
      })
    } else if (!isPending) {
      setUser(null)
    }
  }, [session, setUser, isPending])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await authClient.signIn.email({ email, password })
      if (error) {
        setError(error.message)
        throw new Error(error.message)
      }
      // Session will update automatically via useSession hook
    } catch (err: any) {
      // Error is set, rethrow for component
      throw err
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
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: fullName,
      })
      if (error) {
        setError(error.message)
        throw new Error(error.message)
      }
      // Session will update automatically via useSession hook
    } catch (err: any) {
      // Error is set, rethrow for component
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    // This function will be removed from home.tsx, but we can leave the mock here for now
    // or remove it entirely if it's not used anywhere else.
    console.warn('loginWithGoogle is not implemented');
  }

  const loginWithGitHub = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({ provider: 'github' });
      // On successful redirect from GitHub, the useSession hook will update the state.
    } catch (err: any) {
      setError(err.message || 'GitHub login failed');
      throw err;
    } finally {
      // The page will redirect, so this might not be reached.
      setIsLoading(false);
    }
  }

  const logout = (): void => {
    authClient.signOut()
    logoutUser()
  }

  const value: AuthContextType = useMemo(() => ({
    login,
    signup,
    loginWithGoogle,
    loginWithGitHub,
    logout,
    isAuthenticated,
    isLoading: isLoading || isPending,
    error: state.error,
  }), [login, signup, loginWithGoogle, loginWithGitHub, logout, isAuthenticated, isLoading, isPending, state.error])

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
