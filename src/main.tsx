import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [{ path: "", element: <DashboardPage /> }],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
  {
    basename: "/toptune",
  }
);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
