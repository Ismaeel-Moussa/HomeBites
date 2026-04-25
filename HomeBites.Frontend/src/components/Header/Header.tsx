import { Layout, Button, Avatar } from 'antd'
import { UserOutlined, CheckCircleFilled, MenuOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './Header.module.scss'

const { Header: AntHeader } = Layout

interface HeaderProps {
  onHamburgerClick?: () => void
  showHamburger?: boolean
}

export default function Header({ onHamburgerClick, showHamburger }: HeaderProps) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Resolve full URL for the profile image
  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5132'
  const fullProfileUrl = user?.profileImageUrl 
    ? (user.profileImageUrl.startsWith('http') ? user.profileImageUrl : `${apiBase}/${user.profileImageUrl}`)
    : undefined

  return (
    <AntHeader className={styles.header}>
      <div className={styles.left}>
        {/* Hamburger — only on mobile when authenticated */}
        {showHamburger && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onHamburgerClick}
            className={styles.hamburger}
          />
        )}
        <div className={styles.logoGroup} onClick={() => navigate('/')}>
          <div className={styles.logoBox}>
            <span className={styles.logoIcon}>🍽️</span>
          </div>
          <span className={styles.brandName}>HomeBites</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Kitchens</Link>
          <Link to="/dishes" className={styles.navLink}>All Dishes</Link>
        </div>
      </div>

      <div className={styles.right}>
        {isAuthenticated ? (
          <div className={styles.userSection} onClick={() => navigate(user?.familyId ? `/family/${user.familyId}` : '/dashboard/profile')}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Home Cook'}</span>
              <div className={styles.badge}>
                <CheckCircleFilled className={styles.badgeIcon} />
                <span className={styles.badgeText}>Verified Home Cook</span>
              </div>
            </div>
            <Avatar 
              size={40} 
              src={fullProfileUrl} 
              icon={<UserOutlined />}
              className={styles.avatar}
            />
          </div>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')} className={styles.loginBtn}>
            Log in for family
          </Button>
        )}
      </div>
    </AntHeader>
  )
}
