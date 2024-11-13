<template>
  <virtual-el-popover
    trigger="hover"
    :teleported="true"
    placement="bottom-start"
  >
    <template #trigger>
      <div class="regular-text-color cursor-pointer">
        <Icon
          v-if="$colorMode.preference === 'dark'"
          size="24"
          name="fluent:weather-moon-16-regular"
        />
        <Icon
          v-else-if="$colorMode.preference === 'light'"
          size="24"
          name="fluent:weather-sunny-16-regular"
        />
        <Icon v-else size="24" name="fluent:desktop-16-regular" />
      </div>
    </template>
    <div class="flex flex-col">
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'light' }"
        @click="handleChangeColorMode('light')"
      >
        <Icon size="24" name="fluent:weather-sunny-16-regular" />
        <span>浅色模式</span>
      </div>
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'dark' }"
        @click="handleChangeColorMode('dark')"
      >
        <Icon size="24" name="fluent:weather-moon-16-regular" />
        <span>深色模式</span>
      </div>
      <div
        class="action-item"
        :class="{ 'text-primary': $colorMode.preference === 'system' }"
        @click="handleChangeColorMode('system')"
      >
        <Icon size="24" name="fluent:desktop-16-regular" />
        <span>跟随系统</span>
      </div>
    </div>
  </virtual-el-popover>
</template>

<script setup lang="ts">
// colorMode.value 为 dark/light，colorMode.preference 为 dark/light/system
const colorMode = useColorMode()

function handleChangeColorMode(v: string) {
  colorMode.preference = v
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center gap-[8px] px-[8px] py-[6px];
}
</style>
