<template>
  <n-layout class="default-layout pb-[20px] bg-page-light dark:bg-page-dark">
    <n-layout-header class="sticky h-[60px] z-50 left-0 right-0 top-0 flex py-0 px-[20px] items-center justify-between shadow bg-block-light dark:bg-block-dark">
      <div class="flex">
        <n-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <n-icon-wrapper :size="36" :border-radius="36">
              <n-icon :size="28" :component="Home24Regular">
              </n-icon>
            </n-icon-wrapper>
          </template>
        </n-button>
      </div>
      <n-space class="items-center">
        <n-input placeholder="搜索关键字" v-model="searchWord">
          <template #prefix>
            <n-icon :component="Search12Regular" />
          </template>
        </n-input>

        <LayoutUser/>

        <n-switch class="ml-[20px]" v-model:value="colorModel" @update:value="handleChange" size="large" checked-value="dark" unchecked-value="light">
          <template #checked-icon>
            <n-icon :component="WeatherMoon16Regular" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="WeatherSunny20Regular" />
          </template>
        </n-switch>
      </n-space>
    </n-layout-header>
    <n-layout-content class="mt-[20px] mx-auto overflow-visible w-[960px] bg-page-light dark:bg-page-dark lg:w-auto xl:w-[1140px]">
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
      <div class="mt-[20px]">
        <n-card>bottom</n-card>
      </div>
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
const searchWord = ref()
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
