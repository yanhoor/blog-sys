<template>
  <NConfigProvider :theme="darkMode ? darkTheme : null">
    <NuxtPage/>
  </NConfigProvider>
</template>

<script setup>
import { NConfigProvider, darkTheme } from 'naive-ui'

// const colorModel = useColorMode()
const darkMode = useDarkMode()
onMounted(() => {
  // 还要加个setTimeout 主题才会换??
  setTimeout(() => {
    console.log('=======app=======', darkMode.value, localStorage.getItem('vueuse-color-scheme'))
    const s = localStorage.getItem('vueuse-color-scheme')
    darkMode.value = s === 'dark'
    console.log('=============app2222=======', darkMode.value, process.client)

    const userRandomKey = localStorage.getItem('random-key')
    if(!userRandomKey){
      const t = new Date().getTime()
      const r = Math.floor(Math.random() * 9999 + 10000)
      localStorage.setItem('random-key', t + '' + r)
    }
  }, 300)
})
</script>
