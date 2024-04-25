<template>
  <div class="layout-user">
    <div class="flex cursor-pointer items-center gap-[6px]" v-if="userInfo">
      <n-button type="primary" @click="showWritePost = true" size="small">
        <template #icon>
          <Icon name="fluent:compose-20-regular"></Icon>
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
import { NButton, NDropdown, NBadge } from 'naive-ui'
import type {
  DialogOptions
} from 'naive-ui'
import { socketClient } from '@/socketIo'
import { Icon } from '#components'

const renderIcon = (name: string) => {
  return () => {
    return h(Icon, { name, size: '18' })
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
    icon: renderIcon('fluent:person-circle-20-regular')
  },
  {
    label: '个人主页',
    key: 'userHome',
    icon: renderIcon('fluent:calendar-person-20-regular')
  },
  {
    label: '我的收藏',
    key: 'myCollection',
    icon: renderIcon('fluent:star-20-filled')
  },
  {
    label: `通知消息${
      notificationUnreadCount.value ? `(${notificationUnreadCount.value})` : ''
    }`,
    key: 'myNotification',
    icon: renderIcon('fluent:chat-20-regular')
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('fluent:arrow-circle-right-20-regular')
  }
])

async function handleDropdownSelect(key: string | number) {
  switch (key) {
    case 'userHome':
      handleUserHome()
      break
    case 'profile':
      await navigateTo({ name: 'user-profile' })
      break
    case 'myCollection':
      await navigateTo({ name: 'my-collection' })
      break
    case 'myNotification':
      await navigateTo('/notification')
      break
    case 'logout':
      handleLogout()
      break
  }
}

async function handleUserHome() {
  await navigateTo({ path: '/user/id/' + userInfo.value?.id })
}

async function handleLogout() {
  const { message, dialog } = useDiscreteApi(['message', 'dialog'])
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
  if (['/user/profile', '/'].includes(route.path)) {
    await navigateTo({ path: '/', replace: true })
  }
}

function handleWritePostShowUpdate(v: boolean) {
  showWritePost.value = v
  setTimeout(() => (writePostKey.value = new Date().getTime()), 300)
}
</script>
