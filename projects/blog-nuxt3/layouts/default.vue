<template>
  <n-layout class="default-layout">
    <n-layout-header class="header">
      <div class="header-left">
        <n-button type="primary">登录</n-button>
      </div>
      <div class="header-right">
        <n-input placeholder="搜索关键字" v-model="searchWord">
          <template #prefix>
            <n-icon :component="Search12Regular" />
          </template>
        </n-input>
        <n-switch class="dark-switch" v-model:value="colorModel" @update:value="handleChange" size="large" checked-value="dark" unchecked-value="light">
          <template #checked-icon>
            <n-icon :component="WeatherMoon16Regular" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="WeatherSunny20Regular" />
          </template>
        </n-switch>
      </div>
    </n-layout-header>
    <n-layout-content class="main-content">
      <n-card class="main-left">
        <slot name="left">123324234</slot>
      </n-card>
      <div class="main-right">
        <n-card shadow="never" class="main-content-container">
          <slot></slot>
        </n-card>
        <n-card class="main-right-aside">
          <slot name="right">dwdwed</slot>
        </n-card>
      </div>
      <div class="hidden-lg-and-up">
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
  NCard,
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NLayoutHeader
} from "naive-ui"
import { Search12Regular, WeatherSunny20Regular, WeatherMoon16Regular } from '@vicons/fluent'
import { useColorMode } from '@vueuse/core'

const searchWord = ref()
const colorModel = useColorMode()
const darkMode = useDarkMode()

onMounted(() => {
  console.log('=============default=======', darkMode.value, localStorage.getItem('vueuse-color-scheme'))
  const s = localStorage.getItem('vueuse-color-scheme')
  colorModel.value = s === 'dark' ? 'dark' : 'light'
})

function handleChange(val) {
  console.log('=======handleChange======', val)
  darkMode.value = val === 'dark'
}
</script>

<style lang="scss" scoped>
.n-layout.default-layout{
  overflow: initial;
  background-color: var(--page-background-color);
  :deep(.n-layout-scroll-container){
    overflow-x: initial;
  }
}
.header{
  position: sticky;
  height: var(--header-height);
  z-index: 999;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px var(--n-border-color);
  background-color: var(--page-background-color);
  .header-right{
    display: flex;
    align-items: center;
    .dark-switch{
      margin-left: 12px;
    }
  }
}

.main-content{
  margin: 20px auto;
  overflow: visible;
  width: 960px;
  background-color: var(--page-background-color);
  .main-left{
    position: sticky;
    top: calc(var(--header-height) + 60px);
    width: 48px;
    float: left;
    margin-left: -60px;
  }
  .main-right{
    display: flex;
    align-items: flex-start;
    .main-content-container{
      flex: 1;
      margin-right: 12px;
    }
    .main-right-aside{
      width: 300px;
    }
  }
}

@media (max-width: 1200px) {
  .main-content{
    width: 960px;
    .main-left{
      display: none;
    }
    .main-right-aside{
      display: none;
    }
  }
}

@media (min-width: 1200px) {
  .main-content{
    width: 1140px;
  }
}

</style>
