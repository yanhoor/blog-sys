export default defineNuxtRouteMiddleware((to, from) => {
  // const { message } = useDiscreteApi(['message'])
  const token = useCookie('token')
  // console.log('=============', token, to.fullPath, from.fullPath, message.error)
  if (!token.value) {
    // abortNavigation('未登录')
    return navigateTo('/', { replace: true })
  }
})
