import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar/Sidebar'

const { Content } = Layout

export default function RootLayout() {
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  if (!isAuthenticated) {
    return <Outlet />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 280, 
        transition: 'all 0.2s',
        minHeight: '100vh',
        background: 'var(--color-surface)' 
      }}>
        <Content style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
