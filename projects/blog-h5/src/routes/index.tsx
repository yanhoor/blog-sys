import { RouteObject, Navigate } from 'react-router-dom'
import IndexPage from '@/pages/index/Index'
import TestRoutePage from '@/pages/test/test-route/TestRoute'
import TestPage from '@/pages/test/index/Test'
import TestId from '@/pages/test/test-id/TestId'
import IndexHomePage from '@/pages/index/home/IndexHome'
import IndexSearchPage from '@/pages/index/search/IndexSearch'
import IndexNewPage from '@/pages/index/new/IndexNew'
import IndexNotificationPage from '@/pages/index/notification/IndexNotification'
import IndexMyPage from '@/pages/index/my/IndexMy'
import LoginPage from '@/pages/login/LoginPage'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/index"></Navigate>
  },
  {
    path: '/index',
    element: <IndexPage></IndexPage>,
    children: [
      {
        // path: '/index/home',
        index: true,
        element: <IndexHomePage></IndexHomePage>
      },
      {
        path: '/index/search',
        element: <IndexSearchPage></IndexSearchPage>
      },
      {
        path: '/index/new',
        element: <IndexNewPage></IndexNewPage>
      },
      {
        path: '/index/notification',
        element: <IndexNotificationPage></IndexNotificationPage>
      },
      {
        path: '/index/my',
        element: <IndexMyPage></IndexMyPage>
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>
  },
  {
    path: '/test',
    element: <TestPage></TestPage>,
    children: [
      {
        path: '/test/test-route',
        element: <TestRoutePage></TestRoutePage>
      },
      {
        path: '/test/:id',
        element: <TestId></TestId>
      }
    ]
  }
]

export default routes
