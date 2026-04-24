import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar/Sidebar'
import Header from '../components/Header/Header'

const { Content } = Layout

const MOBILE_BREAKPOINT = 768

export default function RootLayout() {
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Mobile drawer state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false) // close drawer when going back to desktop
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Computed left margin for desktop only
  const desktopMargin = isAuthenticated ? (collapsed ? 72 : 260) : 0

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header onHamburgerClick={() => setMobileOpen(true)} showHamburger={isMobile && isAuthenticated} />
      <Layout style={{ marginTop: 64 }}>
        {isAuthenticated && (
          <Sidebar
            collapsed={collapsed}
            onCollapse={setCollapsed}
            isMobile={isMobile}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
        )}

        {/* Backdrop for mobile drawer */}
        {isMobile && mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(30, 48, 66, 0.45)',
              backdropFilter: 'blur(2px)',
              zIndex: 899,
            }}
          />
        )}

        <Layout
          style={{
            marginLeft: isMobile ? 0 : desktopMargin,
            transition: 'margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: 'calc(100vh - 64px)',
            background: 'var(--color-surface)',
          }}
        >
          <Content style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

