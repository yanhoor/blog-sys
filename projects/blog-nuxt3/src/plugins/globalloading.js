import VueViewer from 'v-viewer'

// 显示顶部加载条
export default defineNuxtPlugin((nuxtApp) => {
  // const bar = ref(null)
  //
  nuxtApp.hook('app:created', (vueApp) => {
    vueApp.use(VueViewer)
  })
  // nuxtApp.hook("app:mounted", (e) => {
  //   if (!bar.value) {
  //     const { loadingBar } = createDiscreteApi(["loadingBar"])
  //     bar.value = loadingBar
  //   }
  // })
  // nuxtApp.hook("page:start", (e) => {
  //   bar.value?.start()
  // })
  // nuxtApp.hook("page:finish", (e) => {
  //   setTimeout(() => bar.value?.finish(), 300)
  // })
  // nuxtApp.hook("app:error", (e) => {
  //   //判断是否在客户端
  //   if (import.meta.client) {
  //     setTimeout(() => bar.value?.finish(), 300)
  //   }
  // })
})
