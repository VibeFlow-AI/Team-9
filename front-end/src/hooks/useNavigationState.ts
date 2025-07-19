import { useState, useEffect, useCallback } from 'react'

interface NavigationState {
  currentTab: string
  previousTab: string | null
  history: string[]
}

/**
 * 🔥 NAVIGATION STATE HOOK
 * Persists navigation state across page refreshes
 * Maintains tab history and allows restoration
 */
export function useNavigationState(
  key: string,
  defaultTab: string,
  options?: {
    maxHistory?: number
    persistHistory?: boolean
  }
) {
  const { maxHistory = 10, persistHistory = true } = options || {}

  const [navigationState, setNavigationState] = useState<NavigationState>(() => {
    if (!persistHistory) {
      return {
        currentTab: defaultTab,
        previousTab: null,
        history: [defaultTab],
      }
    }

    try {
      const saved = localStorage.getItem(`navigation_${key}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          currentTab: parsed.currentTab || defaultTab,
          previousTab: parsed.previousTab || null,
          history: parsed.history || [defaultTab],
        }
      }
    } catch (error) {
      console.error('Failed to load navigation state:', error)
    }

    return {
      currentTab: defaultTab,
      previousTab: null,
      history: [defaultTab],
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (persistHistory) {
      try {
        localStorage.setItem(`navigation_${key}`, JSON.stringify(navigationState))
      } catch (error) {
        console.error('Failed to save navigation state:', error)
      }
    }
  }, [navigationState, key, persistHistory])

  const navigateToTab = useCallback((tab: string) => {
    setNavigationState(prev => {
      const newHistory = [...prev.history]
      
      // Remove tab if it already exists in history
      const existingIndex = newHistory.indexOf(tab)
      if (existingIndex !== -1) {
        newHistory.splice(existingIndex, 1)
      }
      
      // Add to end of history
      newHistory.push(tab)
      
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.splice(0, newHistory.length - maxHistory)
      }

      return {
        currentTab: tab,
        previousTab: prev.currentTab,
        history: newHistory,
      }
    })
  }, [maxHistory])

  const goToPreviousTab = useCallback(() => {
    if (navigationState.previousTab) {
      navigateToTab(navigationState.previousTab)
    }
  }, [navigationState.previousTab, navigateToTab])

  const clearHistory = useCallback(() => {
    setNavigationState({
      currentTab: defaultTab,
      previousTab: null,
      history: [defaultTab],
    })
    
    if (persistHistory) {
      localStorage.removeItem(`navigation_${key}`)
    }
  }, [defaultTab, key, persistHistory])

  return {
    currentTab: navigationState.currentTab,
    previousTab: navigationState.previousTab,
    history: navigationState.history,
    navigateToTab,
    goToPreviousTab,
    clearHistory,
  }
}
