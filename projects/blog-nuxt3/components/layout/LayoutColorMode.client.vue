<template>
  <n-popover>
    <div class="flex flex-col">
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'light' }"
        @click="handleChangeColorMode('light')"
      >
        <n-icon size="24" :component="WeatherSunny20Regular" />
        <span>浅色模式</span>
      </div>
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'dark' }"
        @click="handleChangeColorMode('dark')"
      >
        <n-icon size="24" :component="WeatherMoon16Regular" />
        <span>深色模式</span>
      </div>
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'system' }"
        @click="handleChangeColorMode('system')"
      >
        <n-icon size="24" :component="Desktop24Regular" />
        <span>跟随系统</span>
      </div>
    </div>
    <template #trigger>
      <div class="cursor-pointer">
        <n-icon
          size="24"
          :component="WeatherMoon16Regular"
          v-if="$colorMode.preference === 'dark'"
        />
        <n-icon
          size="24"
          :component="WeatherSunny20Regular"
          v-else-if="$colorMode.preference === 'light'"
        />
        <n-icon size="24" :component="Desktop24Regular" v-else />
      </div>
    </template>
  </n-popover>
</template>

<script setup lang="ts">
import { NPopover, NIcon, darkTheme } from 'naive-ui'
import {
  WeatherSunny20Regular,
  WeatherMoon16Regular,
  Desktop24Regular
} from '@vicons/fluent'

// colorMode.value 为 dark/light，colorMode.preference 为 dark/light/system
const colorMode = useColorMode()
const uiTheme = useUITheme()

function handleChangeColorMode(v: string) {
  colorMode.preference = v
  nextTick(
    () => (uiTheme.value = colorMode.value === 'dark' ? darkTheme : null)
  )
  // console.log(
  //   '=======handleChangeColorMode========',
  //   v,
  //   colorMode.preference,
  //   colorMode.value
  // )
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center gap-[8px] px-[8px] py-[6px];
}
</style>
