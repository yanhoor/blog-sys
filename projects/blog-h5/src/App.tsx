import router from '@/routes'
import React, { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { getMyInfo } from '@/store/user/asyncThunk'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMyInfo())
  }, [])

  // return <RouterProvider router={router} />
  return router
}

export default App
