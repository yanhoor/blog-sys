<template>
  <div class="cursor-pointer flex items-center gap-[6px]" v-if="userInfo">
    <n-button type="primary" @click="showWritePost = true" size="small">
      <template #icon>
        <n-icon :component="Compose24Regular"/>
      </template>
    </n-button>
    <n-dropdown :options="userOptions" @select="handleDropdownSelect">
      <UserAvatar :user="userInfo" disabled/>
    </n-dropdown>
    <layout-notification />
  </div>
  <n-button type="primary" v-else @click="navigateTo('/login')">登录</n-button>
  <n-modal
    :close-on-esc="false"
    v-model:show="showWritePost"
    preset="card"
    size="huge"
    title="快捷发布"
    class="w-1/2"
  >
    <PostWrite @complete="showWritePost = false"/>
  </n-modal>
</template>

<script lang="ts" setup>
import {
  NButton,
  NSpace,
  NModal,
  NIcon,
  NDropdown,
  createDiscreteApi
} from "naive-ui"
import {ArrowCircleRight20Regular, CalendarPerson20Regular, PersonCircle12Regular, Compose24Regular} from "@vicons/fluent"
import {Component} from "vue"
import websocket from '@/websocket'

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const config = useRuntimeConfig()
const userInfo = useUserInfo()
const route = useRoute()
const showWritePost = ref(false)
const token = useCookie('token')
const userOptions = ref([
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
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(ArrowCircleRight20Regular)
  }
])

function handleDropdownSelect(key: string | number){
  switch (key) {
    case 'userHome':
      handleUserHome()
      break
    case 'profile':
      navigateTo({ name: 'user-profile' })
      break
    case 'logout':
      handleLogout()
      break
  }
}

async function handleUserHome(){
  await navigateTo({ path: '/user/' + userInfo.value?.id })
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
          websocket.closeWs()
          checkCurrentPath()
        }
      }catch (e) {

      }
    },
    onNegativeClick: () => {

    }
  })
}

// 假如当前在需要登录的页面
async function checkCurrentPath() {
  if(['/user/profile'].includes(route.path)){
    await navigateTo({ path: '/', replace: true })
  }
}
</script>

