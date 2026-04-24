import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import MenuManagementPage from './pages/MenuManagementPage'
import ProfileManagementPage from './pages/ProfileManagementPage'
import HomePage from './pages/HomePage'
import FamilyProfilePage from './pages/FamilyProfilePage'
import './App.scss'

// ─── Page Placeholders ─────────────────────────────────────────────────────
// Each page will be built and imported by the respective team member.
// For now, these are lightweight stubs so the router works immediately.

// ─── Simple Auth Guard ─────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AppContent() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* ── Public ── */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<SignUpPage />} />
        <Route path="/family/:id"  element={<FamilyProfilePage />} />

        {/* ── Protected Dashboard ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="profile" element={<ProfileManagementPage />} />
          <Route index element={<Navigate to="/dashboard/menu" replace />} />
        </Route>
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
