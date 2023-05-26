<template>
  <div class="layout-user">
    <div class="flex cursor-pointer items-center gap-[6px]" v-if="userInfo">
      <n-button type="primary" @click="showWritePost = true" size="small">
        <template #icon>
          <n-icon :component="Compose24Regular" />
        </template>
      </n-button>
      <n-dropdown :options="userOptions" @select="handleDropdownSelect">
        <n-badge :value="notificationUnreadCount" :max="99">
          <UserAvatar :title="userInfo.name" :user="userInfo" disabled />
        </n-badge>
      </n-dropdown>
    </div>
    <n-button type="primary" v-else @click="navigateTo('/login')"
      >登录</n-button
    >

    <PostWrite
      :show="showWritePost"
      @update:show="handleWritePostShowUpdate"
      :key="writePostKey"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  NButton,
  NIcon,
  NDropdown,
  createDiscreteApi,
  DialogOptions,
  NBadge
} from 'naive-ui'
import {
  ArrowCircleRight20Regular,
  CalendarPerson20Regular,
  PersonCircle12Regular,
  Compose24Regular,
  Star48Filled,
  Chat24Regular
} from '@vicons/fluent'
import { Component, h } from 'vue'
import { socketClient } from '@/socketIo'

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const config = useRuntimeConfig()
const notificationUnreadCount = useNotificationUnreadCount()
const userInfo = useUserInfo()
const route = useRoute()
const showWritePost = ref(false)
const token = useCookie('token')
const writePostKey = ref(new Date().getTime())

const userOptions = computed(() => [
  {
    label: '个人资料',
    key: 'profile',
    icon: renderIcon(PersonCircle12Regular)
  },
  {
    label: '个人主页',
    key: 'userHome',
    icon: renderIcon(CalendarPerson20Regular)
  },
  {
    label: '我的收藏',
    key: 'myCollection',
    icon: renderIcon(Star48Filled)
  },
  {
    label: `通知消息${
      notificationUnreadCount.value ? `(${notificationUnreadCount.value})` : ''
    }`,
    key: 'myNotification',
    icon: renderIcon(Chat24Regular)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(ArrowCircleRight20Regular)
  }
])

function handleDropdownSelect(key: string | number) {
  switch (key) {
    case 'userHome':
      handleUserHome()
      break
    case 'profile':
      navigateTo({ name: 'user-profile' })
      break
    case 'myCollection':
      navigateTo({ name: 'my-collection' })
      break
    case 'myNotification':
      navigateTo('/notification')
      break
    case 'logout':
      handleLogout()
      break
  }
}

async function handleUserHome() {
  await navigateTo({ path: '/user/' + userInfo.value?.id })
}

async function handleLogout() {
  const { message, dialog } = createDiscreteApi(['message', 'dialog'])
  dialog.error({
    title: '退出登录',
    content: '确定退出？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const { success, result, msg } = await useFetchPost('/user/logout', {})
        if (!success) {
          message.error(msg as string)
        } else {
          token.value = ''
          userInfo.value = null
          socketClient?.disconnect()
          checkCurrentPath()
        }
      } catch (e) {}
    },
    onNegativeClick: () => {}
  } as DialogOptions)
}

// 假如当前在需要登录的页面
async function checkCurrentPath() {
  if (['/user/profile'].includes(route.path)) {
    await navigateTo({ path: '/', replace: true })
  }
}

function handleWritePostShowUpdate(v: boolean) {
  showWritePost.value = v
  setTimeout(() => (writePostKey.value = new Date().getTime()), 300)
}
</script>
