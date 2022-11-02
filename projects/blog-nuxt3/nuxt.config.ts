// https://v3.nuxtjs.org/api/configuration/nuxt.config

console.log('===============', process.env.NODE_ENV, process.env.BASE_API)
const lifecycle = process.env.npm_lifecycle_event
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
    // The private keys which are only available server-side
    apiSecret: '123', // .env 文件里 NUXT_API_SECRET 的值(即NUXT_ 开头的值)
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.NUXT_API_BASE, // 这个好像不会自动获取 NUXT_ 开头的值
      imageBase: process.env.NUXT_IMAGE_BASE, // 这个好像不会自动获取 NUXT_ 开头的值
    }
  },
  app: {
    head: {
      script: [
        {
          src: './prism.js'
        }
      ],
      link: [
        {rel: 'stylesheet', href: './prism.css'}
      ]
    }
  },
  modules: [
    '@vueuse/nuxt'
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
