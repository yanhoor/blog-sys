import { defineStore } from 'pinia'

interface State {
  currentRef: HTMLVideoElement | HTMLAudioElement | null
}

export const useMediaPlayStore = defineStore('mediaPlay', {
  state: (): State => ({
    currentRef: null
  })
})
