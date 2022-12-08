import { User } from '@/types/user'
import websocket from '@/websocket'
export const useUserInfo = () => {
  return useState<User | null>('userInfo', () => null)
}

export const useRefreshUserInfo = async () => {
  const userInfo = useUserInfo()
  const token = useCookie("token")
  if(token.value && !userInfo.value) {
    try{
      const { result, success } = await useFetchGet('/user/info', { })
      if(success){
        userInfo.value = result
        websocket.init()
      }
      useFetchNotificationList() // todo: 为什么放在 if(success) 里面就报错
    }catch (e) {

    }
  }
}
