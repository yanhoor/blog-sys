<template>
  <n-layout class="default-layout min-h-full pb-[20px] bg-page-light dark:bg-page-dark">
    <n-layout-header class="sticky h-[60px] z-50 left-0 right-0 top-0 flex py-0 px-[20px] items-center justify-between shadow bg-block-light dark:bg-block-dark">
      <div class="flex">
        <n-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <n-icon :size="28" :component="Home24Regular">
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="flex items-center gap-[12px]">
        <LayoutSearch />

        <LayoutUser/>

        <n-switch v-model:value="colorModel" @update:value="handleChange" size="large" checked-value="dark" unchecked-value="light">
          <template #checked-icon>
            <n-icon :component="WeatherMoon16Regular" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="WeatherSunny20Regular" />
          </template>
        </n-switch>
      </div>
    </n-layout-header>
    <n-layout-content class="mt-[20px] mx-auto overflow-visible w-auto lg:w-[1024px] bg-page-light dark:bg-page-dark">
      <!--<div class="main-left">
        <slot name="left"></slot>
      </div>-->
      <div class="flex items-start">
        <div class="flex-1 max-w-full">
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
  NInput,
  NSwitch,
  NSpace,
  NAvatar,
  NCard,
  NIcon,
  NDropdown,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NIconWrapper,
  createDiscreteApi
} from "naive-ui"
import { Search12Regular, WeatherSunny20Regular, WeatherMoon16Regular, Home24Regular } from '@vicons/fluent'
import { useColorMode } from '@vueuse/core'

const config = useRuntimeConfig()
const colorModel = useColorMode()
const darkMode = useDarkMode()
const userInfo = useUserInfo()

function handleChange(val: string) {
  // console.log('=======handleChange======', val)
  darkMode.value = val === 'dark'
}

</script>

<style lang="scss" scoped>
.n-layout.default-layout{
  overflow: initial;
  :deep(.n-layout-scroll-container){
    overflow-x: initial;
  }
}
</style>
