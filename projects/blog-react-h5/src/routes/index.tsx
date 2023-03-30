import IndexPage from '@/pages/index/Index'
import TestRoutePage from '@/pages/test/test-route/TestRoute'
import TestPage from '@/pages/test/index/Test'
import TestId from '@/pages/test/test-id/TestId'
import App from '@/App'
import { RouteObject } from "react-router-dom"

const routes: RouteObject[] =  [
  {
    path: '/',
    element: <App></App>,
  },
  {
    path: '/index',
    element: <IndexPage></IndexPage>,
  },
  {
    path: '/test',
    element: <TestPage></TestPage>,
    children: [
      {
        path: '/test/test-route',
        element: <TestRoutePage></TestRoutePage>,
      },
      {
        path: '/test/:id',
        element: <TestId></TestId>,
      }
    ]
  }
]

export default routes
