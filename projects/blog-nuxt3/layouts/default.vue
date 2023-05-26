<template>
  <n-layout
    class="default-layout min-h-full bg-page-light pb-[20px] dark:bg-page-dark"
  >
    <n-layout-header
      class="sticky left-0 right-0 top-0 z-50 flex h-[60px] items-center justify-between gap-[12px] bg-block-light px-[20px] py-0 shadow dark:bg-block-dark"
    >
      <div class="flex">
        <n-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <n-icon :size="28" :component="Home24Regular"> </n-icon>
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
      class="mx-auto mt-[20px] w-auto overflow-visible bg-page-light dark:bg-page-dark lg:w-[1024px]"
    >
      <!--<div class="main-left">
        <slot name="left"></slot>
      </div>-->
      <div class="flex items-start">
        <div class="max-w-full flex-1">
          <slot></slot>
        </div>
        <!--<div class="main-right-aside">
          <slot name="right">dwdwed</slot>
        </div>-->
      </div>
      <!--<div class="mt-[20px]">
        <n-card>bottom</n-card>
      </div>-->
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import {
  NButton,
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutHeader
} from 'naive-ui'
import { Home24Regular } from '@vicons/fluent'

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
