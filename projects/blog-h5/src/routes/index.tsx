import {
  RouteObject,
  Navigate,
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements
} from 'react-router-dom'
import store from '@/store'
import { getMyInfo } from '@/store/user/asyncThunk'
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
import UserPage from '@/pages/user/UserPage'
import FollowerListPage from '@/pages/followerList/FollowerListPage'
import FollowingListPage from '@/pages/followingList/FollowingListPage'
import UserAlbumPage from '@/pages/userAlbum/UserAlbumPage'
import RegisterPage from '@/pages/register/RegisterPage'
import SearchResultPage from '@/pages/searchResult/SearchResultPage'
import MyConfig from '@/config'
import ErrorPage from '@/routes/ErrorPage'
import MyCollectionPage from '@/pages/myCollections/MyCollectionPage'
import MyLikePage from '@/pages/myLikes/MyLikePage'
import MyCommentPage from '@/pages/myComments/MyCommentPage'

type RouteObjectType = {
  auth?: boolean
  key?: string
  children?: RouteObjectType[]
} & RouteObject

async function authLoader() {
  const myInfo = store.getState().user.myInfo

  const token = localStorage.getItem(MyConfig.TOKEN)
  if (!token) throw { isLogin: false }

  if (!myInfo) {
    try {
      const result = await store.dispatch(getMyInfo()).unwrap()
      return true
    } catch (e) {
      // console.log('=======authLoader===error=======', e)
      throw { isLogin: false }
    }
  }
  return true
}

const routes = [
  {
    path: '/',
    // element: <Navigate to="/index"></Navigate>,
    element: <Layout />,
    children: [
      // 默认路由
      {
        index: true, // 参考 https://reactrouter.com/en/6.11.1/start/concepts#index-routes
        key: 'root',
        element: <Navigate to="/index"></Navigate> // 定向到 /index，然后 /index 再定向到 IndexHomePage
      },
      {
        path: 'index',
        element: <IndexPage></IndexPage>,
        children: [
          {
            // path: '/index/home',
            index: true, // /index 的默认路由
            key: 'index-home',
            element: <IndexHomePage></IndexHomePage>
          },
          {
            path: 'search',
            element: <IndexSearchPage></IndexSearchPage>
          },
          {
            path: 'new',
            auth: true,
            element: <IndexNewPage></IndexNewPage>
          },
          {
            path: 'notification',
            auth: true,
            element: <IndexNotificationPage></IndexNotificationPage>
          },
          {
            path: 'my',
            auth: true,
            key: 'index-my',
            element: <IndexMyPage></IndexMyPage>
          }
        ]
      },
      {
        path: 'login',
        element: <LoginPage></LoginPage>
      },
      {
        path: 'register',
        element: <RegisterPage></RegisterPage>
      },
      {
        path: 'searchResult',
        element: <SearchResultPage></SearchResultPage>
      },
      {
        path: 'myCollections',
        auth: true,
        element: <MyCollectionPage></MyCollectionPage>
      },
      {
        path: 'myLikes',
        auth: true,
        element: <MyLikePage></MyLikePage>
      },
      {
        path: 'myComments',
        auth: true,
        element: <MyCommentPage></MyCommentPage>
      },
      {
        path: 'post/:id',
        element: <PostPage></PostPage>
      },
      {
        path: 'user/:id',
        element: <UserPage></UserPage>
      },
      {
        path: 'follower/:uid',
        element: <FollowerListPage></FollowerListPage>
      },
      {
        path: 'following/:uid',
        element: <FollowingListPage></FollowingListPage>
      },
      {
        path: 'userAlbum/:uid',
        element: <UserAlbumPage></UserAlbumPage>
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
] as RouteObjectType[]

function buildRouteComponent(route: RouteObjectType): ReactNode {
  console.log('======buildRouteComponent========', route)
  if (route.index) {
    return (
      <Route
        index={route.index}
        element={route.element}
        loader={route.auth ? authLoader : undefined}
        errorElement={<ErrorPage />}
        key={route.key || route.path}
      ></Route>
    )
  } else {
    return (
      <Route
        path={route.path}
        loader={route.auth ? authLoader : undefined}
        element={route.element}
        errorElement={<ErrorPage />}
        key={route.key || route.path}
      >
        {route.children &&
          route.children.map((child) => buildRouteComponent(child))}
      </Route>
    )
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(routes.map((route) => buildRouteComponent(route)))
  // routes
)

export default <RouterProvider router={router} />
