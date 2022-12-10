<template>
  <el-switch
    v-model="theme"
    class="mr-2"
    inline-prompt
    :active-icon="Moon"
    :inactive-icon="Sunny"
    @change="handleChange"
    size="large"
  />
</template>

<script setup lang="ts">
import {reactive, ref, watch, watchEffect} from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import {useDarkStore} from "@/store/modules/darkStore"

const theme = ref(false)
const isDark = useDark()
const darkStore = useDarkStore()
theme.value = isDark.value
darkStore.updateIsDark(isDark.value)
const toggleDark = useToggle(isDark)

const handleChange = (value: boolean) => {
  // console.log('=============', value, isDark.value)
  toggleDark()
  theme.value = value
  darkStore.updateIsDark(value)
}

</script>
