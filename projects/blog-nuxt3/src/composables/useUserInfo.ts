import type { User } from 'sys-types'
import { initSocketIo, socketClient } from '@/socketIo'

export const useUserInfo = () => {
  return useState<User | null>('userInfo', () => null)
}

export const useRefreshUserInfo = async () => {
  const userInfo = useUserInfo()
  const config = useRuntimeConfig()
  const token = useCookie('token')
  // console.log('==================', websocket.ws)
  if (token.value && !userInfo.value) {
    try {
      const { result, success, code, msg } = await useFetchGet<User>('/user/info', {})
      if (success) {
        userInfo.value = result
        initSocketIo(config.public.wsHost, userInfo.value?.id as string)
      }
      if (code === 111 || code === 999) {
        token.value = null
      }
    } catch (e) {
      console.log('===============', e)
    }
  } else if (userInfo.value && !socketClient) {
    initSocketIo(config.public.wsHost, userInfo.value?.id as string)
  }
}
