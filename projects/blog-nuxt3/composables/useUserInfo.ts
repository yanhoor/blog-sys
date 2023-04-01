import { User } from '@/types/user'
import websocket from '@/websocket'
export const useUserInfo = () => {
  return useState<User | null>('userInfo', () => null)
}

export const useRefreshUserInfo = async () => {
  const userInfo = useUserInfo()
  const token = useCookie('token')
  // console.log('==================', websocket.ws)
  if (token.value && !userInfo.value) {
    try {
      const { result, success, code, msg } = await useFetchGet('/user/info', {})
      if (success) {
        userInfo.value = result
        websocket.init()
      }
      if (code === 111 || code === 999) {
        token.value = null
      }
    } catch (e) {
      console.log('===============', e)
    }
  } else if (userInfo.value && !websocket.ws) {
    websocket.init()
  }
}
