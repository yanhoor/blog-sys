<template>
  <n-message-provider>
    <NConfigProvider :theme="darkMode ? darkTheme : null" :locale="zhCN" :date-locale="dateZhCN" inline-theme-disabled>
      <!--导航会报错-->
      <!--<NuxtPage :page-key="getPathKey"/>-->
      <NuxtPage/>
    </NConfigProvider>
  </n-message-provider>
</template>

<script setup>
import { NConfigProvider, NMessageProvider, darkTheme, zhCN, dateZhCN } from 'naive-ui'

const colorModel = useColorMode()
const darkMode = useDarkMode()
const route = useRoute()
const userInfo = useUserInfo()
onMounted(() => {
  // 还要加个setTimeout 主题才会换??
  setTimeout(() => {
    const s = localStorage.getItem('vueuse-color-scheme')
    darkMode.value = s === 'dark'
    colorModel.value = s === 'dark' ? 'dark' : 'light'

    const userRandomKey = localStorage.getItem('random-key')
    if(!userRandomKey){
      const t = new Date().getTime()
      const r = Math.floor(Math.random() * 9999 + 10000)
      localStorage.setItem('random-key', t + '' + r)
    }
  }, 300)

  if(userInfo.value){
    useFetchNotificationList()
  }
})

function getPathKey() {
  return route.fullPath
}
</script>
