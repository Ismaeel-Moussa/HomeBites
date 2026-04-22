import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from '../components/Sidebar/Sidebar'

const { Content } = Layout

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'all 0.2s' }}>
        <Content style={{ padding: '2rem', background: 'var(--color-surface)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
