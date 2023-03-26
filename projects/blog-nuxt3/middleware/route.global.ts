export default defineNuxtRouteMiddleware(async (to, from) => {
  // console.log('========route.global 1111111========')
  await useRefreshUserInfo()
  // console.log('========route.global 2222222========')
})
