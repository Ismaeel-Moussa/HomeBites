import { Outlet } from 'react-router-dom'
import styles from './DashboardLayout.module.scss'

export default function DashboardLayout() {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  )
}
