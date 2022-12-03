<template>
  <NConfigProvider :theme="darkMode ? darkTheme : null" :locale="zhCN" :date-locale="dateZhCN">
    <NuxtPage/>
  </NConfigProvider>
</template>

<script setup>
import { NConfigProvider, darkTheme, zhCN, dateZhCN } from 'naive-ui'

// const colorModel = useColorMode()
const darkMode = useDarkMode()
onMounted(() => {
  // 还要加个setTimeout 主题才会换??
  setTimeout(() => {
    const s = localStorage.getItem('vueuse-color-scheme')
    darkMode.value = s === 'dark'

    const userRandomKey = localStorage.getItem('random-key')
    if(!userRandomKey){
      const t = new Date().getTime()
      const r = Math.floor(Math.random() * 9999 + 10000)
      localStorage.setItem('random-key', t + '' + r)
    }
  }, 300)
})
</script>
