import { User } from '@/types/user'
import websocket from '@/websocket'
import {createDiscreteApi} from "naive-ui"
export const useUserInfo = () => {
  return useState<User | null>('userInfo', () => null)
}

export const useRefreshUserInfo = async () => {
  const userInfo = useUserInfo()
  const token = useCookie("token")
  const { notification } = createDiscreteApi(["notification"])
  if(token.value && !userInfo.value) {
    try{
      const { result, success, code, msg } = await useFetchGet('/user/info', { })
      if(success){
        userInfo.value = result
        websocket.init()
      }
      if(code === 111 || code === 999){
        token.value = null
        notification.error({
          content: msg
        })
      }
      useFetchNotificationList() // todo: 为什么放在 if(success) 里面就报错
    }catch (e) {

    }
  }
}
