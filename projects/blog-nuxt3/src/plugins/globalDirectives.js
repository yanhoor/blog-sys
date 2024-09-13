import directives from '@/directives'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

// 注册全局指令，https://nuxt.com/docs/guide/directory-structure/plugins，参考底部
export default defineNuxtPlugin((nuxtApp) => {
  for (let k in directives) {
    // console.log('====defineNuxtPlugin directives=====', import.meta.client, k, directives[k])
    nuxtApp.vueApp.directive(k, directives[k])
  }
  nuxtApp.vueApp.directive(autoAnimatePlugin)
})
