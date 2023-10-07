<template>
  <n-layout
    class="default-layout min-h-full bg-page-light pb-[20px] dark:bg-page-dark"
  >
    <n-layout-header
      class="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between gap-[12px] bg-block-light px-[20px] py-0 shadow dark:bg-block-dark"
    >
      <div class="flex">
        <n-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <Icon name="fluent:home-20-regular" size="20"></Icon>
          </template>
        </n-button>
      </div>
      <div class="flex items-center gap-[12px]">
        <LayoutSearch />

        <LayoutUser />

        <LayoutColorMode />
      </div>
    </n-layout-header>
    <n-layout-content
      class="mx-auto mt-[80px] w-auto overflow-visible bg-page-light dark:bg-page-dark"
    >
      <div class="flex items-start">
        <div class="flex max-w-full flex-1 justify-center">
          <slot></slot>
        </div>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import { NButton, NLayout, NLayoutContent, NLayoutHeader } from 'naive-ui'

const config = useRuntimeConfig()
const userInfo = useUserInfo()
</script>

<style lang="postcss" scoped>
.n-layout.default-layout {
  overflow: initial;
  :deep(.n-layout-scroll-container) {
    overflow-x: initial;
  }
}
</style>
