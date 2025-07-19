import { useAuth } from "@/contexts"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/"
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate(redirectTo)
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, navigate])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // If user is authenticated but shouldn't access this route (like login page), redirect
  if (!requireAuth && isAuthenticated) {
    navigate("/student/dashboard") // or wherever authenticated users should go
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
