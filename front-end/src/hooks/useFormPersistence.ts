import { useState, useEffect, useCallback } from 'react'

export interface FormPersistenceOptions {
  key: string
  debounceMs?: number
  clearOnSubmit?: boolean
}

/**
 * 🔥 FORM PERSISTENCE HOOK
 * Automatically saves and restores form data to/from localStorage
 * Prevents data loss on page refresh or navigation
 */
export function useFormPersistence<T extends Record<string, any>>(
  initialData: T,
  options: FormPersistenceOptions
) {
  const { key, debounceMs = 500, clearOnSubmit = true } = options
  
  const [data, setData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData
    } catch (error) {
      console.error('Failed to load form data:', error)
      return initialData
    }
  })

  const [isDirty, setIsDirty] = useState(false)

  // Auto-save with debouncing
  useEffect(() => {
    if (!isDirty) return

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data))
        setIsDirty(false)
      } catch (error) {
        console.error('Failed to save form data:', error)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [data, isDirty, debounceMs, key])

  // Update data and mark as dirty
  const updateData = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    setData(prev => {
      const newData = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates }
      setIsDirty(true)
      return newData
    })
  }, [])

  // Clear saved data
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setData(initialData)
      setIsDirty(false)
    } catch (error) {
      console.error('Failed to clear form data:', error)
    }
  }, [key, initialData])

  // Submit handler
  const handleSubmit = useCallback(() => {
    if (clearOnSubmit) {
      clearData()
    }
  }, [clearOnSubmit, clearData])

  // Navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasData = Object.values(data).some(value => {
        if (typeof value === 'string') return value.trim() !== ''
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0
        return value !== false && value !== 0 && value !== null && value !== undefined
      })
      
      if (hasData && isDirty) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [data, isDirty])

  return {
    data,
    updateData,
    clearData,
    handleSubmit,
    isDirty,
    isDataLoaded: true,
  }
}
