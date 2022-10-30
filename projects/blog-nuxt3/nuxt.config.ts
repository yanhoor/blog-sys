// https://v3.nuxtjs.org/api/configuration/nuxt.config
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";

const lifecycle = process.env.npm_lifecycle_event
export default defineNuxtConfig({
  build: {
    transpile: lifecycle === "build" ? ["element-plus"] : [],
  },
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
