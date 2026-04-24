import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div style={{ padding: '2rem'}}>
      <Outlet />
    </div>
  )
}
