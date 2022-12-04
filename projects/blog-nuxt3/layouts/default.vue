<template>
  <n-layout class="default-layout">
    <n-layout-header class="header">
      <div class="header-left">
        <div class="user-container" v-if="userInfo">
          <n-space>
            <n-dropdown :options="userOptions" @select="handleDropdownSelect">
              <n-avatar round :src="config.imageBase + userInfo.avatar"></n-avatar>
            </n-dropdown>
            <n-button type="primary" @click="navigateTo('/writeBlog')">写文章</n-button>
          </n-space>
        </div>
        <n-button type="primary" v-else @click="toLogin">登录</n-button>
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
        <slot name="left"></slot>
      </n-card>
      <div class="main-right">
        <div class="main-content-container">
          <slot></slot>
        </div>
        <n-card class="main-right-aside">
          <slot name="right">dwdwed</slot>
        </n-card>
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
  createDiscreteApi
} from "naive-ui"
import { Search12Regular, WeatherSunny20Regular, WeatherMoon16Regular, ArrowCircleRight20Regular, CalendarPerson20Regular, PersonCircle12Regular, TextBulletListSquareEdit20Regular } from '@vicons/fluent'
import { useColorMode } from '@vueuse/core'
import type { Component } from 'vue'
import {useFetchPost} from "~/composables/useBaseFetch";

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const config = useRuntimeConfig()
const searchWord = ref()
const colorModel = useColorMode()
const darkMode = useDarkMode()
const userInfo = useUserInfo()
const token = useCookie('token')
const userOptions = ref([
  {
    label: '个人中心',
    key: 'profile',
    icon: renderIcon(PersonCircle12Regular)
  },
  {
    label: '个人主页',
    key: 'userHome',
    icon: renderIcon(CalendarPerson20Regular)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(ArrowCircleRight20Regular)
  }
])

onMounted(() => {
  const s = localStorage.getItem('vueuse-color-scheme')
  colorModel.value = s === 'dark' ? 'dark' : 'light'
})

function handleChange(val: string) {
  // console.log('=======handleChange======', val)
  darkMode.value = val === 'dark'
}

function toLogin(){
  navigateTo('/login')
}

function handleDropdownSelect(key: string | number){
  switch (key) {
    case 'logout':
      handleLogout()
      break
  }
}

async function handleLogout(){
  const { message, dialog } = createDiscreteApi(["message", "dialog"])
  dialog.error({
    title: '退出登录',
    content: '确定退出？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try{
        const {success, result, msg} = await useFetchPost('/user/logout', {})
        if(!success){
          message.error(msg as string)
        }else{
          token.value = ''
          userInfo.value = null
          await navigateTo('/login', { replace: true })
        }
      }catch (e) {

      }
    },
    onNegativeClick: () => {

    }
  })
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
    .user-container{
      cursor: pointer;
    }
  }
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
