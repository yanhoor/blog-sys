<template>
  <NConfigProvider :theme="darkMode ? darkTheme : null">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </NConfigProvider>
</template>

<script setup>
import { darkTheme } from 'naive-ui'
import { NConfigProvider } from 'naive-ui'
import { useColorMode } from '@vueuse/core'

// const colorModel = useColorMode()
const darkMode = useDarkMode()
onMounted(() => {
  console.log('=============app=======', darkMode.value, localStorage.getItem('vueuse-color-scheme'))
  const s = localStorage.getItem('vueuse-color-scheme')
  darkMode.value = s === 'dark'
})
</script>
