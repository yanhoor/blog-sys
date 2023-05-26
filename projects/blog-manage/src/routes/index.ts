import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/userStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/home',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/blog',
        component: () => import('@/views/blog/BlogList.vue'),
        meta: {
          title: '博客列表'
        }
      },
      {
        path: '/comment',
        component: () => import('@/views/comment/CommentList.vue'),
        meta: {
          title: '评论列表'
        }
      },
      {
        path: '/me',
        component: () => import('@/views/user/Me.vue'),
        meta: {
          title: '个人信息'
        }
      },
      {
        path: '/user',
        component: () => import('@/views/user/List.vue'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/mobileVersion',
        component: () => import('@/views/mobileVersion/MobileVersionList.vue'),
        meta: {
          title: '版本列表'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/:path*',
    component: () => import('@/views/PageNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/manage/'), // 因为应用部署在 /manage/ 子目录
  routes
})

router.beforeEach((to, from) => {
  return new Promise(async (resolve, reject) => {
    const userStore = useUserStore()
    // console.log('beforeEach', to)
    if (!userStore.user && to.path != '/login') {
      await userStore
        .getUserInfo()
        .then((r) => {
          r ? resolve() : resolve('/login')
        })
        .catch(() => {
          reject()
        })
    } else {
      resolve()
    }
  })
})

export default router
