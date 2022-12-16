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
  // console.log('-----------------', userInfo.value, websocket.ws)
  if(token.value && !userInfo.value) {
    try{
      const { result, success, code, msg } = await useFetchGet('/user/info', { })
      if(success){
        userInfo.value = result
      }
      if(code === 111 || code === 999){
        token.value = null
        return notification.error({
          content: msg
        })
      }
    }catch (e) {

    }
  } else if(userInfo.value && !websocket.ws){
    websocket.init()
  }
}
