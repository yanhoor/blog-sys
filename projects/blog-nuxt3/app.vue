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
  uiTheme.value = colorMode.value === 'dark' ? darkTheme : null

  if (userInfo.value) {
    useFetchNotificationCount()
  }

  if (userInfo.value && !socketClient) {
    initSocketIo(config.public.wsHost, userInfo.value?.id as string)
  }
})

function getPathKey() {
  return route.fullPath
}
</script>
