import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/home";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
