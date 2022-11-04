export const useUserInfo = () => {
  return useState('userInfo', () => null)
}

export const useRefreshUserInfo = async () => {
  const userInfo = useUserInfo()
  const token = useCookie("token")
  if(token.value && !userInfo.value) {
    try{
      const { data, error } = await useFetchGet('/user/info', { })
      const res = unref(data)
      if(res.success){
        userInfo.value = res.result
      }
    }catch (e) {

    }
  }
}
