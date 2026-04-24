import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar/Sidebar'
import Header from '../components/Header/Header'

const { Content } = Layout

export default function RootLayout() {
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout style={{ marginTop: 64 }}>
        {isAuthenticated && (
          <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        )}
        <Layout style={{ 
          marginLeft: isAuthenticated ? (collapsed ? 72 : 260) : 0, 
          transition: 'all 0.2s',
          minHeight: 'calc(100vh - 64px)',
          background: 'var(--color-surface)' 
        }}>
          <Content style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
