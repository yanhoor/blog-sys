// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { visualizer } from 'rollup-plugin-visualizer'
import { nodePolyfills } from 'vite-plugin-node-polyfills' // https://stackoverflow.com/questions/78115258/module-has-been-externalized-for-browser-compatibility-error

const isProd = process.env.NODE_ENV === 'production'
console.log(
  '======defineNuxtConfig=========',
  isProd,
  process.env.NODE_ENV,
  process.env.NUXT_API_BASE
)
// const prodRoot = location.protocol + '//' + location.host
export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  build: {
    // 解决生产环境第三方包引入可能报错，参考 https://nuxt.com/docs/guide/concepts/esm#transpiling-libraries
    transpile: isProd ? ['v-viewer'] : [],
    analyze: {
      open: true // nuxt analyze 时打开分析结果页面
      // template: 'sunburst', // sunburst, treemap, network, raw-data, list
    }
  },

  runtimeConfig: {
    // 私有key，仅服务端可用
    apiSecret: '123', // .env 文件里 NUXT_API_SECRET 的值(即NUXT_ 开头的值)
    // 在 public 里面的 key 可以在客户端和服务端使用
    public: {
      apiBase: process.env.NUXT_API_BASE, // 这个好像不会自动获取 NUXT_ 开头的值
      apiBaseDocker: process.env.NUXT_API_BASE_DOCKER,
      // imageBase: 'https://static-buck.oss-cn-shenzhen.aliyuncs.com',
      imageBase: isProd
        ? 'https://niubility.website/static/uploadFile/' // 通过 ndoe 访问，如果直接通过 nginx 访问，可以改成 https://niubility.website/uploadFile/
        : 'http://127.0.0.1:8000/static/uploadFile/',
      wsHost: process.env.NUXT_WS_HOST,
      imageType: '.jpeg,.jpg,.png,.avif,.webp,.bmp,.gif,.svg',
      videoType: '.mp4,.mov,.avi,.mkv',
      audioType: '.mp3,.wav,.flac,.aac,.m4a,.ogg,.webm,.mp4'
    }
  },

  app: {
    // baseURL: '/blog/',
    head: {
      titleTemplate: '%s - Nuxt3 | Vipot',
      title: 'Nuxt3 | Vipot',
      charset: 'utf-8',
      meta: [
        {
          'http-equiv': 'Content-Security-Policy',
          content:
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'"
        },
        {
          name: 'keywords',
          content: 'vue3, nuxt3, ssr, naive ui, tailwind css'
        },
        { name: 'description', content: '基于vue3的nuxt3框架SSR博客站点' }
      ],
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
          href: './icon.png'
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
    // 预渲染
    // prerender: {
    //   crawlLinks: true,
    //   routes: ['/']
    // }
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icon',
    // https://auto-animate.formkit.com/#usage-vue
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
    'nuxt-icon'
  ],
  elementPlus: {
    // importStyle: false
    // imports: ['useLocale'],
    // injectionID: { prefix: 1024, current: 0 },
    themes: ['dark'] // global.css 已经手动引入
  },

  // @nuxtjs/color-mode 配置，参考 https://color-mode.nuxtjs.org/#configuration
  colorMode: {
    preference: 'system', // default value of $colorMode.preference, dark/light/system
    fallback: 'light', // fallback value if not system preference found
    // hid: 'nuxt-color-mode-script',
    // globalName: '__NUXT_COLOR_MODE__',
    // componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  // css: ['@/assets/styles/index.css'],

  tailwindcss: {
    // https://tailwindcss.nuxtjs.org/getting-started/configuration
    // cssPath: ['~/assets/styles/tailwind.css', { injectPosition: 'last' }]
    cssPath: false // tailwindcss 的 HMR 会失效，需要手动刷新
  },

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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'v-viewer': ['v-viewer']
          }
        }
      }
    },
    plugins: [visualizer(), nodePolyfills()],
    esbuild: {
      drop: ['console', 'debugger']
    },
    css: {
      preprocessorOptions: {
        // scss: {
        //   additionalData: '@use "@/assets/styles/var.scss" as *;'
        // }
      }
    },
    optimizeDeps: {
      include: ['sys-types']
    }
  },

  // auto import components
  components: true,

  devtools: {
    enabled: false
  },
  workspaceDir: '../../'
})
