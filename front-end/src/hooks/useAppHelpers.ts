import { useCallback } from 'react'
import { useAppContext, useAppActions, useAuth } from '@/contexts'
import { useNavigate } from 'react-router'

export const useAppHelpers = () => {
  const { state } = useAppContext()
  const actions = useAppActions()
  const auth = useAuth()
  const navigate = useNavigate()

  // Check if user is authenticated and has completed onboarding
  const isUserReady = useCallback(() => {
    if (!auth.isAuthenticated || !state.user) return false
    
    if (state.user.role === 'student') {
      return !!state.studentData
    } else if (state.user.role === 'mentor') {
      return !!state.mentorData
    }
    
    return false
  }, [auth.isAuthenticated, state.user, state.studentData, state.mentorData])

  // Navigate to appropriate dashboard based on user role
  const goToDashboard = useCallback(() => {
    if (!state.user) return
    
    if (state.user.role === 'student') {
      navigate('/student/dashboard')
    } else if (state.user.role === 'mentor') {
      navigate('/mentor/dashboard')
    }
  }, [state.user, navigate])

  // Navigate to appropriate onboarding based on user role
  const goToOnboarding = useCallback(() => {
    if (!state.user) return
    
    if (state.user.role === 'student') {
      navigate('/student/onboarding')
    } else if (state.user.role === 'mentor') {
      navigate('/mentor/onboarding')
    }
  }, [state.user, navigate])

  // Complete logout and redirect
  const handleLogout = useCallback(() => {
    auth.logout()
    navigate('/')
  }, [auth, navigate])

  // Get user display name
  const getUserDisplayName = useCallback(() => {
    if (state.user) {
      return state.user.fullName || state.user.email
    }
    return 'User'
  }, [state.user])

  // Get user avatar URL or initials
  const getUserAvatar = useCallback(() => {
    if (state.user?.profilePicture) {
      return state.user.profilePicture
    }
    return null
  }, [state.user])

  const getUserInitials = useCallback(() => {
    if (state.user?.fullName) {
      return state.user.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return 'U'
  }, [state.user])

  return {
    // State
    state,
    user: state.user,
    studentData: state.studentData,
    mentorData: state.mentorData,
    bookedSessions: state.bookedSessions,
    isLoading: state.isLoading,
    error: state.error,
    
    // Auth
    isAuthenticated: auth.isAuthenticated,
    authLoading: auth.isLoading,
    authError: auth.error,
    
    // Actions
    ...actions,
    login: auth.login,
    signup: auth.signup,
    loginWithGoogle: auth.loginWithGoogle,
    loginWithGitHub: auth.loginWithGitHub,
    logout: handleLogout,
    
    // Helpers
    isUserReady,
    goToDashboard,
    goToOnboarding,
    getUserDisplayName,
    getUserAvatar,
    getUserInitials,
  }
}

export default useAppHelpers
