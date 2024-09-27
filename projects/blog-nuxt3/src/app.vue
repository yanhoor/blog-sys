<template>
  <NuxtLayout>
    <!--导航会报错-->
    <!--<NuxtPage :page-key="getPathKey"/>-->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { initSocketIo, socketClient } from '@/socketIo'

const colorMode = useColorMode()
const userInfo = useUserInfo()
const config = useRuntimeConfig()

onMounted(() => {
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
  console.log('===========', e.matches)
  if (colorMode.preference === 'system') {
    colorMode.value = e.matches ? 'dark' : 'light'
  }
}
</script>
