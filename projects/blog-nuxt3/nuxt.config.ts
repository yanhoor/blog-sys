// https://v3.nuxtjs.org/api/configuration/nuxt.config

console.log('===============', process.env.NODE_ENV, process.env.NUXT_API_BASE)
const isProd = process.env.NODE_ENV === 'production'
// const prodRoot = location.protocol + '//' + location.host
export default defineNuxtConfig({
  build: {
    // 解决生产环境第三方包引入可能报错，参考 https://nuxt.com/docs/guide/concepts/esm#transpiling-libraries
    transpile: isProd
      ? [
          'naive-ui',
          'vueuc',
          'v-viewer',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer'
        ]
      : ['@juggle/resize-observer']
  },
  runtimeConfig: {
    // 私有key，仅服务端可用
    apiSecret: '123', // .env 文件里 NUXT_API_SECRET 的值(即NUXT_ 开头的值)
    // 在 public 里面的 key 可以在客户端和服务端使用
    public: {
      apiBase: process.env.NUXT_API_BASE, // 这个好像不会自动获取 NUXT_ 开头的值
      apiBaseDocker: process.env.NUXT_API_BASE_DOCKER,
      imageBase: 'https://static-buck.oss-cn-shenzhen.aliyuncs.com',
      wsHost: process.env.NUXT_WS_HOST,
      imageType: '.jpeg,.jpg,.png,.avif,.webp,.bmp,.gif,.svg',
      videoType: '.mp4,.mov,.avi,.mkv',
      audioType: '.mp3,.wav,.flac,.aac,.m4a,.ogg,.webm,.mp4'
    }
  },
  app: {
    baseURL: '/blog/',
    head: {
      titleTemplate: '%s - Nuxt3 | 博客',
      title: 'Nuxt3 | 博客',
      charset: 'utf-8',
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
          rel: 'icon',
          href: 'https://nuxt.com/icon.png'
        }
      ]
    }
    // https://nuxt.com/docs/getting-started/transitions
    // pageTransition: {
    //   name: 'page',
    //   mode: 'out-in' // default
    // },
    // layoutTransition: {
    //   name: 'layout',
    //   mode: 'out-in' // default
    // }
  },
  // https://v3.nuxtjs.org/getting-started/deployment
  nitro: {
    preset: 'node-server'
  },
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  // @nuxtjs/color-mode 配置，参考 https://color-mode.nuxtjs.org/#configuration
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    // hid: 'nuxt-color-mode-script',
    // globalName: '__NUXT_COLOR_MODE__',
    // componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  css: ['@/assets/styles/var.css', '@/assets/styles/global.css'],
  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
      // 压缩 css, 参考 https://www.tailwindcss.cn/docs/optimizing-for-production
      ...(isProd ? { cssnano: {} } : {})
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        // scss: {
        //   additionalData: '@use "@/assets/styles/var.scss" as *;'
        // }
      }
    },
    optimizeDeps: {
      include: [
        'naive-ui',
        'vueuc',
        'date-fns-tz/esm/formatInTimeZone',
        'sys-types'
      ]
    }
  },
  // auto import components
  components: true
})
