import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardLayout from './layouts/DashboardLayout'
import MenuManagementPage from './pages/MenuManagementPage'
import ProfileManagementPage from './pages/ProfileManagementPage'
import './App.scss'

// ─── Page Placeholders ─────────────────────────────────────────────────────
// Each page will be built and imported by the respective team member.
// For now, these are lightweight stubs so the router works immediately.

const PlaceholderPage = ({ name }: { name: string }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1rem',
      fontFamily: 'var(--font-headline)',
      color: 'var(--color-on-surface-variant)',
    }}
  >
    <span style={{ fontSize: '3rem' }}>🍽️</span>
    <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{name}</h2>
    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)' }}>
      This page is under construction.
    </p>
  </div>
)

// ─── Public Pages ──────────────────────────────────────────────────────────
// Owner: Ali Shwail
const Home = () => <PlaceholderPage name="Home — Browse Dishes" />

// Owner: Omar
const FamilyProfile = () => <PlaceholderPage name="Family Profile & Menu" />

// ─── Simple Auth Guard ─────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AppContent() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"            element={<Home />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<SignUpPage />} />
      <Route path="/family/:id"  element={<FamilyProfile />} />

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
