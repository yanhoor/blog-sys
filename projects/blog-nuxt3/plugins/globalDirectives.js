import directives from '@/directives'

// 注册全局指令，https://nuxt.com/docs/guide/directory-structure/plugins，参考底部
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", (vueApp) => {
    for (let k in directives){
      vueApp.directive(k, directives[k])
    }
  })
})
