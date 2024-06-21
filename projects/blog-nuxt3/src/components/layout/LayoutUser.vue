<template>
  <div class="layout-user">
    <div class="flex cursor-pointer items-center gap-[6px]" v-if="userInfo">
      <el-button type="primary" @click="showWritePost = true" size="small">
        <template #icon>
          <Icon name="fluent:compose-20-regular"></Icon>
        </template>
      </el-button>
      <el-dropdown @command="handleDropdownSelect">
        <el-badge
          :value="notificationUnreadCount"
          :max="99"
          :hidden="!notificationUnreadCount"
        >
          <UserAvatar :title="userInfo.name" :user="userInfo" disabled />
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="action of userOptions"
              :key="action.key"
              :command="action.key"
              >{{ action.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-button type="primary" v-else @click="navigateTo('/login')"
      >登录</el-button
    >

    <LazyPostWrite
      :show="showWritePost"
      @update:show="handleWritePostShowUpdate"
      :key="writePostKey"
    />
  </div>
</template>

<script lang="ts" setup>
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
  ElMessageBox.confirm('确定退出？', '退出登录', {
    type: 'error',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      try {
        const { success, result, msg } = await $HttpUtils.post(
          '/user/logout',
          {}
        )
        if (!success) {
          ElMessage.error(msg as string)
        } else {
          token.value = ''
          userInfo.value = null
          socketClient?.disconnect()
          checkCurrentPath()
        }
      } catch (e) {}
    })
    .catch(() => {})
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
