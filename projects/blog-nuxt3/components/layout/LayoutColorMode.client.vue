<template>
  <n-popover>
    <div class="flex flex-col">
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'light' }"
        @click="handleChangeColorMode('light')"
      >
        <Icon size="24" name="fluent:weather-sunny-16-regular"></Icon>
        <span>浅色模式</span>
      </div>
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'dark' }"
        @click="handleChangeColorMode('dark')"
      >
        <Icon size="24" name="fluent:weather-moon-16-regular"></Icon>
        <span>深色模式</span>
      </div>
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'system' }"
        @click="handleChangeColorMode('system')"
      >
        <Icon size="24" name="fluent:desktop-16-regular"></Icon>
        <span>跟随系统</span>
      </div>
    </div>
    <template #trigger>
      <div class="cursor-pointer">
        <Icon
          size="24"
          name="fluent:weather-moon-16-regular"
          v-if="$colorMode.preference === 'dark'"
        ></Icon>
        <Icon
          size="24"
          name="fluent:weather-sunny-16-regular"
          v-else-if="$colorMode.preference === 'light'"
        ></Icon>
        <Icon size="24" name="fluent:desktop-16-regular" v-else></Icon>
      </div>
    </template>
  </n-popover>
</template>

<script setup lang="ts">
import { NPopover, darkTheme } from 'naive-ui'

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
