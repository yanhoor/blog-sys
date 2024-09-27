import { defineStore } from 'pinia'
import StoreTypes from '../storeTypes'

interface State {
  currentRef: HTMLVideoElement | HTMLAudioElement | null
}

export const useMediaPlayStore = defineStore(StoreTypes.MEDIA_PLAYER, {
  state: (): State => ({
    currentRef: null
  })
})
