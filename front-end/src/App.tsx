import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/home";
import RoleSelectionPage from "./pages/role-selection";
import StudentOnboardingPage from "./pages/student/onboarding";
import StudentDashboardPage from "./pages/student/dashboard";
import MentorOnboardingPage from "./pages/mentor/onboarding";
import MentorDashboardPage from "./pages/mentor/dashboard";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/role-selection",
    element: <RoleSelectionPage />,
  },
  {
    path: "/student/onboarding",
    element: <StudentOnboardingPage />,
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboardPage />,
  },
  {
    path: "/mentor/onboarding",
    element: <MentorOnboardingPage />,
  },
  {
    path: "/mentor/dashboard",
    element: <MentorDashboardPage />,
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
