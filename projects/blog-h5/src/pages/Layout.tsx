import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    console.log('=========路由变化===========', location)
  }, [location])

  return (
    <div className="layout h-full">
      <Outlet />
      <ScrollRestoration
        getKey={(location, matches) => {
          // default behavior
          console.log('======ScrollRestoration=======', matches)
          return location.pathname + location.search
        }}
      />
    </div>
  )
}
