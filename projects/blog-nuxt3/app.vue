<template>
  <NConfigProvider
    class="bg-page-light dark:bg-page-dark"
    :theme="uiTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    inline-theme-disabled
  >
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <!--导航会报错-->
      <!--<NuxtPage :page-key="getPathKey"/>-->
      <NuxtPage />
    </NuxtLayout>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, darkTheme, zhCN, dateZhCN } from 'naive-ui'
import { initSocketIo, socketClient } from '@/socketIo'

const colorMode = useColorMode()
const uiTheme = useUITheme()
const route = useRoute()
const userInfo = useUserInfo()
const config = useRuntimeConfig()

onMounted(() => {
  // console.log('=========app mounted=============')
  // 对于服务端渲染的 naive ui 需要这样才起效？
  setTimeout(() => {
    uiTheme.value = colorMode.value === 'dark' ? darkTheme : null
  }, 300)

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', handleSystemModeChange)

  if (userInfo.value) {
    useFetchNotificationCount()
  }

  if (userInfo.value && !socketClient) {
    initSocketIo(config.public.wsHost, userInfo.value?.id as string)
  }
})

onUnmounted(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', handleSystemModeChange)
})

function handleSystemModeChange(e: MediaQueryListEvent) {
  if (colorMode.preference === 'system') {
    uiTheme.value = e.matches ? darkTheme : null
  }
}

function getPathKey() {
  return route.fullPath
}
</script>
