import {
  RouteObject,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  DataRouteObject,
  RouterProvider
} from 'react-router-dom'
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
import PostPage from '@/pages/post/PostPage'
import Layout from '@/pages/Layout'
import React, { ReactNode } from 'react'
import CommentDetailPage from '@/pages/commentDetail/commentDetailPage'

type RouteObjectType = {
  auth?: boolean
  key?: string
  children?: RouteObjectType[]
} & RouteObject

const routes: RouteObject[] = [
  {
    path: '/',
    // element: <Navigate to="/index"></Navigate>,
    element: <Layout />,
    children: [
      // 默认路由
      {
        index: true, // 参考 https://reactrouter.com/en/6.11.1/start/concepts#index-routes
        element: <Navigate to="/index"></Navigate> // 定向到 /index，然后 /index 再定向到 IndexHomePage
      },
      {
        path: 'index',
        element: <IndexPage></IndexPage>,
        children: [
          {
            // path: '/index/home',
            index: true, // /index 的默认路由
            // key: '/index/home',
            element: <IndexHomePage></IndexHomePage>
          },
          {
            path: 'search',
            element: <IndexSearchPage></IndexSearchPage>
          },
          {
            path: 'new',
            element: <IndexNewPage></IndexNewPage>
          },
          {
            path: 'notification',
            element: <IndexNotificationPage></IndexNotificationPage>
          },
          {
            path: 'my',
            element: <IndexMyPage></IndexMyPage>
          }
        ]
      },
      {
        path: 'login',
        element: <LoginPage></LoginPage>
      },
      {
        path: 'post/:id',
        element: <PostPage></PostPage>
      },
      {
        path: 'commentDetail/:id',
        element: <CommentDetailPage></CommentDetailPage>
      },
      {
        path: 'test',
        element: <TestPage></TestPage>,
        children: [
          {
            path: 'test-route',
            element: <TestRoutePage></TestRoutePage>
          },
          {
            path: ':id',
            // key: 'test-id',
            element: <TestId></TestId>
          }
        ]
      }
    ]
  }
]

function buildRouteComponent(route: RouteObjectType): ReactNode {
  console.log('======buildRouteComponent========', route)
  return route.index ? (
    <Route
      index={route.index}
      element={route.element}
      key={route.key || route.path}
    ></Route>
  ) : (
    <Route
      path={route.path}
      element={route.element}
      key={route.key || route.path}
    >
      {route.children &&
        route.children.map((child) => buildRouteComponent(child))}
    </Route>
  )
}

const router = createBrowserRouter(
  // createRoutesFromElements(routes.map((route) => buildRouteComponent(route)))
  routes
)

export default <RouterProvider router={router} />
