import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LandingPage from "./pages/LandingPage"
const AdminPage = lazy(() => import("./pages/Admin"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
import { AuthModalProvider } from "./auth/AuthModalProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthModalProvider themeColor="#4f46e5">
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin page (auth) */}
          <Route path="/admin" element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          } />

          {/* User dashboard (post-auth) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={null}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthModalProvider>
    </BrowserRouter>
  );
}

export default App;