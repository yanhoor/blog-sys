import type { User } from 'sys-types'

export const useUserInfo = () => {
  return useState<User | null>('userInfo', () => null)
}

export const useRefreshUserInfo = async () => {
  const {$webSocketClient, $HttpUtils} = useNuxtApp()
  const userInfo = useUserInfo()
  const config = useRuntimeConfig()
  const token = useCookie('token')
  // console.log('==================', websocket.ws)
  if (token.value && !userInfo.value) {
    try {
      const { result, success, code, msg } = await $HttpUtils.get<User>('/user/info', {})
      if (success) {
        userInfo.value = result as User
        $webSocketClient?.initSocketIo(config.public.wsHost, userInfo.value?.id as string)
      }
    } catch (e) {
      console.log('===============', e)
    }
  } else if (userInfo.value) {
    $webSocketClient?.initSocketIo(config.public.wsHost, userInfo.value?.id as string)
  }
}
