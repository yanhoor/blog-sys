import { useMediaPlayStore } from '~/store/modules/mediaPlayStore'

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      store: useMediaPlayStore($pinia)
    }
  }
})
