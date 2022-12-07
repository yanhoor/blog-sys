<template>
  <n-layout class="default-layout">
    <n-layout-header class="header">
      <div class="header-left">
        <n-button circle type="primary" @click="navigateTo('/')">
          <template #icon>
            <n-icon-wrapper :size="36" :border-radius="36">
              <n-icon :size="28" :component="Home24Regular">
              </n-icon>
            </n-icon-wrapper>
          </template>
        </n-button>
      </div>
      <n-space class="header-right">
        <n-input placeholder="搜索关键字" v-model="searchWord">
          <template #prefix>
            <n-icon :component="Search12Regular" />
          </template>
        </n-input>

        <LayoutUser/>

        <n-switch class="dark-switch" v-model:value="colorModel" @update:value="handleChange" size="large" checked-value="dark" unchecked-value="light">
          <template #checked-icon>
            <n-icon :component="WeatherMoon16Regular" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="WeatherSunny20Regular" />
          </template>
        </n-switch>
      </n-space>
    </n-layout-header>
    <n-layout-content class="main-content">
      <div class="main-left">
        <slot name="left"></slot>
      </div>
      <div class="main-right">
        <div class="main-content-container">
          <slot></slot>
        </div>
        <div class="main-right-aside">
          <slot name="right">dwdwed</slot>
        </div>
      </div>
      <div class="main-bottom">
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
  background-color: var(--block-background-color);
  .header-left{
    display: flex;
  }
  .header-right{
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .main-right{
    display: flex;
    align-items: flex-start;
    .main-content-container{
      flex: 1;
      max-width: 100%;
    }
    .main-right-aside{
      width: 300px;
      position: sticky;
      top: calc(var(--header-height) + 60px);
    }
  }
  .main-bottom{
    margin-top: 20px;
  }
}

@media (max-width: 1200px) {
  .main-content{
    width: auto;
    margin-left: 20px;
    margin-right: 20px;
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
