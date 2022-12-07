import { User } from '@/types/user'
import websocket from '@/websocket'
import {useFetchNotification} from "~/composables/useNotification";
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
        useFetchNotification()
        websocket.init()
      }
    }catch (e) {

    }
  }
}
