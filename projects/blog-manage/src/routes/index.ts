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
        path: '/blogCate',
        component: () => import('@/views/blogCate/BlogCateList.vue'),
        meta: {
          title: '博客分类'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/:path*',
    component: () => import('@/views/PageNotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(), // 因为应用部署在 /manage/ 子目录
  routes
})

router.beforeEach( (to, from) => {
  return new Promise(async (resolve, reject) => {
    const userStore = useUserStore()
    // console.log('beforeEach', to)
    if(!userStore.user && to.path != '/login'){
      await userStore.getUserInfo().then((r) => {
        r ? resolve() : resolve('/login')
      }).catch(() => {
        reject()
      })
    }else{
      resolve()
    }
  })
})

export default router
