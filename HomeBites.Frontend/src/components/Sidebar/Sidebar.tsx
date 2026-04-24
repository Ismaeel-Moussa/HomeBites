import { NavLink } from 'react-router-dom'
import { Layout, Button, Tooltip } from 'antd'
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
      width={250}
      collapsedWidth={85}
      collapsed={collapsed}
      className={`${styles.sider} ${collapsed ? styles.collapsed : ''}`}
      theme="light"
      style={{ marginTop: '64px' }}
    >
      <div className={styles.container}>

        {/* ── Toggle Button ── */}
        <div className={styles.brand} style={{ margin: "5px 0"}}>

          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            className={styles.toggleBtn}
            style={{position: 'absolute', left: collapsed ? '20px' : '25px'}}
          />
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
        <div className={styles.footer} style={{position: 'fixed',bottom: '20px',width: collapsed ? '53px' : '213px'}}>
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
        </nav>



      </div>
    </Sider>
  )
}
