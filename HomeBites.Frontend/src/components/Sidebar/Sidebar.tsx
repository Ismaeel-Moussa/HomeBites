import { NavLink } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { 
  UserOutlined, 
  BookOutlined, 
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import styles from './Sidebar.module.scss'

const { Sider } = Layout

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const { user, logout } = useAuth()


  return (
    <Sider 
      width={280} 
      collapsedWidth={80}
      collapsed={collapsed} 
      className={`${styles.sider} ${collapsed ? styles.collapsed : ''}`} 
      theme="light"
    >
      <div className={styles.container}>
        {/* ── Sidebar Controls ── */}
        <div className={styles.brand} style={{ padding: '1rem', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={() => onCollapse(!collapsed)}
            className={styles.toggleBtn}
          />
        </div>

        {/* ── Navigation ── */}
        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            title={collapsed ? "Home Page" : ""}
          >
            <HomeOutlined className={styles.navIcon} />
            {!collapsed && <span>Home Page</span>}
          </NavLink>
          <NavLink 
            to={user?.familyId ? `/family/${user.familyId}` : '/dashboard/profile'} 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            title={collapsed ? "My Profile" : ""}
          >
            <UserOutlined className={styles.navIcon} />
            {!collapsed && <span>My Profile</span>}
          </NavLink>

          <NavLink 
            to="/dashboard/menu" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            title={collapsed ? "Menu" : ""}
          >
            <BookOutlined className={styles.navIcon} />
            {!collapsed && <span>Menu</span>}
          </NavLink>
        </nav>

        {/* ── Footer / Logout ── */}
        <div className={styles.footer}>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={logout}
            className={styles.logoutBtn}
            block
            title={collapsed ? "Sign Out" : ""}
          >
            {!collapsed && "Sign Out"}
          </Button>
        </div>
      </div>
    </Sider>
  )
}
