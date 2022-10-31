// https://v3.nuxtjs.org/api/configuration/nuxt.config
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";

console.log('===============', process.env.NODE_ENV, process.env.BASE_API)
const lifecycle = process.env.npm_lifecycle_event
export default defineNuxtConfig({
  build: {
    transpile: lifecycle === "build" ? ["element-plus"] : [],
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123', // .env 文件里 NUXT_API_SECRET 的值(即NUXT_ 开头的值)
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.NUXT_API_BASE // 这个好像不会自动获取 NUXT_ 开头的值
    }
  },
  modules: [
    '@vueuse/nuxt',
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
    plugins: [
      Components({
        dts: true,
        resolvers: [IconsResolver({})],
      }),
    ],
  },
  // auto import components
  components: true,
})
