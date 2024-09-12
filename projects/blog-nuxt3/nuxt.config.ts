// https://v3.nuxtjs.org/api/configuration/nuxt.config
import viteCompression from 'vite-plugin-compression'

const isProd = process.env.NODE_ENV === 'production'
console.log(
  '======defineNuxtConfig=========',
  isProd,
  process.env.NODE_ENV,
  process.env.NUXT_API_BASE
)

// 第一项是分组名，第二项是归属该分组的包名或包名数组
const packageMapList: [string, string | string[]][] = [
  ['lodash-es', ['lodash-es', 'nuxt-lodash']],
  ['vueI18n', ['vue-i18n', '@nuxtjs/i18n']],
  ['vue-router', 'vue-router'],
  ['tinymce', 'tinymce'],
  ['prismjs', 'prismjs'],
  ['sys-types', 'sys-types'],
  ['sortablejs', 'sortablejs'],
  ['v-viewer', 'v-viewer'],
  ['socket', 'socket.io-client'],
  ['vueuse', ['@vueuse', '@vueuse/nuxt']],
  ['vue', ['vue', '@vue']],
  ['pina', ['pina', '@pinia/nuxt']],
  // ['nuxt', 'nuxt'], // 报错
  ['lucky-canvas', '@lucky-canvas/vue'],
  [
    'element-plus',
    ['element-plus', '@element-plus/icons-vue', '@element-plus/nuxt']
  ],
  ['vant', ['vant', '@vant/nuxt']],
  ['tailwindcss', ['tailwindcss', '@nuxtjs/tailwindcss']],
  ['swiper', ['swiper', 'nuxt-swiper']],
  ['nuxt-vendor', ['@nuxt/image', 'nuxt-icons', '@nuxtjs/color-mode']],
  [
    'vendor',
    ['ofetch', 'countup.js', 'async-validator', 'ohash', 'aos', 'dayjs']
  ] // 其他具体列出
]

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

  hooks: {
    // https://github.com/nuxt/nuxt/issues/22127#issuecomment-1635925362
    'vite:extendConfig'(config: any) {
      config.build.rollupOptions.output.manualChunks = function (id: string) {
        const isStyleFile = /\.(less|scss|css)$/.test(id)
        // if (isStyleFile) {
        //   console.log('===========isStyleFile==========', id);
        //   return 'style';
        // }
        for (const pair of packageMapList) {
          const packVal = pair[1]
          const packValList = Array.isArray(packVal) ? packVal : [packVal]
          const packList = packValList.map((s) => s.replace(/\//g, '\\/'))
          const reg = new RegExp(
            `[\\\\/]node_modules[\\\\/](${packList.join('|')})[\\\\/]`
          )
          // swiper 的样式文件单独出来就会影响样式覆盖
          // if (id.includes('countup.js')) {
          //   console.log('==============vendor============', pair[0], reg.test(id), reg, id);
          // }
          if (reg.test(id) && !isStyleFile) {
            // console.log(pair[0], '=========匹配到============', id);
            // if (pair[0] === 'vendor') console.log('==============vendor============', id);

            return pair[0]
          }
        }
        // 报错
        // if (id.includes('packages/common-base') || id.includes('point-mall/common')) {
        //   return '@smallrig';
        // }
        // todo: 报错，应该是把 nuxt 抽出来就有问题
        // 其他
        // if (/[\\/]node_modules[\\/]/.test(id)) {
        //   return 'vendor';
        // }
      }
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
          'http-equiv': 'content-security-policy',
          content:
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; object-src 'none'"
        },
        {
          name: 'keywords',
          content: 'vue3, nuxt3, ssr, element-plus, tailwind css'
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
          href: './icon.ico'
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
    'nuxt-icon',
    '@nuxt/scripts'
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

  css: ['@/assets/styles/index.css'],

  tailwindcss: {
    // https://tailwindcss.nuxtjs.org/getting-started/configuration
    cssPath: ['~/assets/styles/tailwind.css', { injectPosition: 'last' }]
    // cssPath: false // tailwindcss 的 HMR 会失效，需要手动刷新
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
          // manualChunks: {
          //   'v-viewer': ['v-viewer']
          // }
        }
      }
    },
    plugins: [
      viteCompression({
        verbose: true,
        disable: false,
        ext: '.gz',
        algorithm: 'gzip', // 压缩格式：gzip、brotliCompress,
        threshold: 10240, // 只处理比这个值大的资源，按字节算
        deleteOriginFile: false // 是否删除原文件
      })
    ],
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
    // optimizeDeps: {
    //   include: ['sys-types']
    // }
  },

  workspaceDir: '../../',
  compatibilityDate: '2024-09-12'
})