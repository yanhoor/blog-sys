import { defineStore } from 'pinia'
import StoreTypes from '../storeTypes'
import $http, { urls } from '@/http'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore(StoreTypes.USER, {
  // 状态被定义为返回初始状态的函数。推荐使用 完整类型推断的箭头函数
  state: () => ({
    user: null
  }),
  actions: {
    async getUserInfo() {
      try {
        const { success, result, msg } = await $http.get(urls.user_info)
        if (!success) {
          ElMessage.error({
            message: msg
          })
        } else {
          this.user = result
          return result
        }
      } catch (e) {}
    }
  }
})
