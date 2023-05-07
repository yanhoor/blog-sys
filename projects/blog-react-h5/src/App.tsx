import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from '@/routes'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getMyInfo } from '@/store/userSlice'

const router = createBrowserRouter(routes)

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMyInfo())
  }, [])

  return <RouterProvider router={router} />
}

export default App
