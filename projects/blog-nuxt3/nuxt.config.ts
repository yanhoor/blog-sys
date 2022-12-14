// https://v3.nuxtjs.org/api/configuration/nuxt.config

console.log('===============', process.env.NODE_ENV, process.env.BASE_API)
const isProd = process.env.NODE_ENV === 'production'
// const prodRoot = location.protocol + '//' + location.host
export default defineNuxtConfig({
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer'
        ]
        : ['@juggle/resize-observer']
  },
  runtimeConfig: {
    // 私有key，仅服务端可用
    apiSecret: '123', // .env 文件里 NUXT_API_SECRET 的值(即NUXT_ 开头的值)
    // 在 public 里面的 key 可以在客户端使用
    public: {
      apiBase: process.env.NUXT_API_BASE, // 这个好像不会自动获取 NUXT_ 开头的值
      imageBase: process.env.NUXT_IMAGE_BASE, // 这个好像不会自动获取 NUXT_ 开头的值
      wsHost: process.env.NUXT_WS_HOST
    }
  },
  app: {
    baseURL: '/blog/',
    head: {
      titleTemplate: "%s - Nuxt3 | 博客",
      title: "Ray",
      charset: "utf-8",
      // meta: [
      //   { name: 'naive-ui-style' },
      // ],
      // 也可以在 server.plugins 目录添加
      // script: [
      //   {
      //     src: './prism.js'
      //   }
      // ],
      link: [
        // { rel: 'stylesheet', href: './prism.css' },
        {
          rel: "icon",
          href: "https://nuxt.com/icon.png",
        },
      ]
    },
    // https://nuxt.com/docs/getting-started/transitions
    pageTransition: {
      name: 'fade',
      mode: 'out-in' // default
    },
    layoutTransition: {
      name: 'slide',
      mode: 'out-in' // default
    }
  },
  // https://v3.nuxtjs.org/getting-started/deployment
  nitro: {
    preset: 'node-server'
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: ["@/assets/styles/global.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/var.scss" as *;'
        }
      }
    },
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : []
    }
  },
  // auto import components
  components: true,
})
