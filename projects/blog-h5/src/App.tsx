import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from '@/routes'
import React, { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { getMyInfo } from '@/store/user/asyncThunk'

const router = createBrowserRouter(routes)

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMyInfo())
  }, [])

  return <RouterProvider router={router} />
}

export default App
