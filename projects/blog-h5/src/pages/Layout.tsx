import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    console.log('=========路由变化===========', location)
  }, [location])

  return (
    <div className="layout h-full">
      <Outlet />
    </div>
  )
}
