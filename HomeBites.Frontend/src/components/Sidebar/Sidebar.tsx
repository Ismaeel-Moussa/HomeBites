import { NavLink } from 'react-router-dom'
import { Layout, Button, Tooltip } from 'antd'
import { 
  UserOutlined, 
  BookOutlined, 
  LogoutOutlined,
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
      width={260} 
      collapsedWidth={72}
      collapsed={collapsed} 
      className={`${styles.sider} ${collapsed ? styles.collapsed : ''}`} 
      theme="light"
    >
      <div className={styles.container}>

        {/* ── Brand ── */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🍽️</span>
          <span className={styles.brandText}>HomeBites</span>
        </div>

        {/* ── Navigation ── */}
        <nav className={styles.nav}>
          <Tooltip title={collapsed ? 'Home Page' : ''} placement="right">
            <NavLink 
              to="/" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <HomeOutlined className={styles.navIcon} />
              <span className={styles.navLabel}>Home Page</span>
            </NavLink>
          </Tooltip>

          <Tooltip title={collapsed ? 'My Profile' : ''} placement="right">
            <NavLink 
              to={user?.familyId ? `/family/${user.familyId}` : '/dashboard/profile'} 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <UserOutlined className={styles.navIcon} />
              <span className={styles.navLabel}>My Profile</span>
            </NavLink>
          </Tooltip>

          <Tooltip title={collapsed ? 'Menu' : ''} placement="right">
            <NavLink 
              to="/dashboard/menu" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <BookOutlined className={styles.navIcon} />
              <span className={styles.navLabel}>Menu</span>
            </NavLink>
          </Tooltip>
        </nav>

        {/* ── Footer / Logout ── */}
        <div className={styles.footer}>
          <Tooltip title={collapsed ? 'Sign Out' : ''} placement="right">
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={logout}
              className={styles.logoutBtn}
              block
            >
              <span className={styles.navLabel}>Sign Out</span>
            </Button>
          </Tooltip>
        </div>

      </div>
    </Sider>
  )
}
