import { useMediaPlayStore } from '~/store/modules/mediaPlayStore'
import type {Pinia} from 'pinia'

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      store: useMediaPlayStore($pinia as Pinia)
    }
  }
})
