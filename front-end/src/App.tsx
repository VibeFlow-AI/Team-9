import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/home";
import RoleSelectionPage from "./pages/role-selection";
import StudentOnboardingPage from "./pages/student/onboarding";
import StudentDashboardPage from "./pages/student/dashboard";
import MentorOnboardingPage from "./pages/mentor/onboarding";
import MentorDashboardPage from "./pages/mentor/dashboard";
import { AppProvider, AuthProvider } from "./contexts";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/role-selection",
    element: (
      <ProtectedRoute>
        <RoleSelectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/onboarding",
    element: (
      <ProtectedRoute>
        <StudentOnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/dashboard",
    element: (
      <ProtectedRoute>
        <StudentDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mentor/onboarding",
    element: (
      <ProtectedRoute>
        <MentorOnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mentor/dashboard",
    element: (
      <ProtectedRoute>
        <MentorDashboardPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
