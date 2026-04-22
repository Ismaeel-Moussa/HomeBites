import { NavLink } from 'react-router-dom'
import { Layout, Button, Avatar } from 'antd'
import { 
  UserOutlined, 
  BookOutlined, 
  LogoutOutlined,
  CheckCircleFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined
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
  
  // Resolve full URL for the profile image
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const fullProfileUrl = user?.profileImageUrl 
    ? (user.profileImageUrl.startsWith('http') ? user.profileImageUrl : `${apiBase}/${user.profileImageUrl}`)
    : undefined

  return (
    <Sider 
      width={280} 
      collapsedWidth={80}
      collapsed={collapsed} 
      className={`${styles.sider} ${collapsed ? styles.collapsed : ''}`} 
      theme="light"
    >
      <div className={styles.container}>
        {/* ── Brand Header ── */}
        <div className={styles.brand}>
          <div className={styles.logoBox}>
            <span className={styles.logoIcon}>🍽️</span>
          </div>
          {!collapsed && <span className={styles.brandName}>HomeBites</span>}
          
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={() => onCollapse(!collapsed)}
            className={styles.toggleBtn}
          />
        </div>

        {/* ── User Profile Card ── */}
        <div className={styles.userCard}>
          <Avatar 
            size={collapsed ? 40 : 64} 
            src={fullProfileUrl} 
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          {!collapsed && (
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{user?.name || 'Home Cook'}</h3>
              <div className={styles.badge}>
                <CheckCircleFilled className={styles.badgeIcon} />
                <span>Verified Home Cook</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className={styles.nav}>
          <NavLink 
            to="/dashboard/profile" 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            title={collapsed ? "Profile" : ""}
          >
            <UserOutlined className={styles.navIcon} />
            {!collapsed && <span>Profile</span>}
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
