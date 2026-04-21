import { Routes, Route, Navigate } from 'react-router-dom'
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

// Owner: Ismaeel
const Login = () => <PlaceholderPage name="Login" />
const SignUp = () => <PlaceholderPage name="Sign Up" />

// Owner: Omar
const FamilyProfile = () => <PlaceholderPage name="Family Profile & Menu" />

// ─── Dashboard Pages (Protected) ───────────────────────────────────────────
// Owner: Ali Anaam
const MenuManagement = () => <PlaceholderPage name="Menu Management" />

// Owner: Yousef
const ProfileManagement = () => <PlaceholderPage name="Profile Management" />

// ─── Simple Auth Guard ─────────────────────────────────────────────────────
// Ismaeel will replace this with a proper context-based guard
const isAuthenticated = () => !!localStorage.getItem('hb_token')

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

// ─── App ───────────────────────────────────────────────────────────────────

function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"            element={<Home />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<SignUp />} />
      <Route path="/family/:id"  element={<FamilyProfile />} />

      {/* ── Protected Dashboard ── */}
      <Route
        path="/dashboard/menu"
        element={
          <ProtectedRoute>
            <MenuManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <ProfileManagement />
          </ProtectedRoute>
        }
      />

      {/* ── Redirect /dashboard → /dashboard/menu ── */}
      <Route path="/dashboard" element={<Navigate to="/dashboard/menu" replace />} />

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
