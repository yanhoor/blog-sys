import { defineStore } from 'pinia'
import StoreTypes from '../storeTypes'

interface State {
  userId: string
  showSelect: boolean
}

export const useFollowGroupSelectStore = defineStore(
  StoreTypes.USER_FOLLOW_GROUP_SELECT,
  {
    state: (): State => ({
      userId: '',
      showSelect: false
    })
  }
)
