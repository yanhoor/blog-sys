import { defineStore } from 'pinia'
import StoreTypes from '../storeTypes'

export const useDarkStore = defineStore(StoreTypes.DARK, {
  state: () => ({
    isDark: false
  }),
  actions: {
    updateIsDark(val: boolean){
      this.isDark = val
    }
  }
})
