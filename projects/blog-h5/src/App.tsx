import Router from '@/routes'
import React, { createContext, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { getMyInfo } from '@/store/user/asyncThunk'
import { useColorMode } from '@/hooks'
import { ThemeContext } from '@/contexts'

function App() {
  const dispatch = useAppDispatch()
  const colorMode = useColorMode()

  useEffect(() => {
    dispatch(getMyInfo())
  }, [])

  // return <RouterProvider router={router} />
  return (
    <ThemeContext.Provider value={colorMode.value}>
      {Router}
    </ThemeContext.Provider>
  )
}

export default App
