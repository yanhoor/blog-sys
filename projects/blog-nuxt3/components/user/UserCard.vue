<template>
  <div class="user-card">
    <n-popover trigger="hover" @update:show="handleShow" class="max-w-[280px]" :disabled="disabled || currentUser?.id === userId">
      <template #trigger>
        <div>
          <slot name="trigger"></slot>
        </div>
      </template>

      <n-spin size="small" v-if="loading"/>

      <div class="p-[12px] flex flex-col items-start gap-[12px] overflow-hidden" v-else>
        <div class="flex items-center gap-[12px] max-w-full">
          <UserAvatar :user="userInfo" :size="36" disabled/>
          <div class="flex flex-col gap-[3px] items-start overflow-hidden">
            <div class="text-green-700 text-[16px] cursor-pointer" @click="navigateTo({ path: '/user/' + userInfo.id })">{{ userInfo?.name }}</div>
            <span class="text-gray-400 text-[12px] truncate max-w-full">{{ userInfo.sign }}</span>
          </div>
        </div>
        <UserFollowDropdown v-if="userInfo.isFollowing" @unfollow="handleFollow(2)" class="w-full" :user="userInfo" @selectGroup="showGroupSelect = true">
          <n-button type="tertiary" class="w-full" size="small" :loading="followLoading">已关注</n-button>
        </UserFollowDropdown>
        <n-button type="primary" class="w-full" size="small" @click="handleFollow(1)" :loading="followLoading" v-else>关注</n-button>
        <div class="flex items-start justify-around w-full custom-border border-t pt-[6px]">
          <div class="statis-item">
            <div class="statis-num">{{ userInfo.followingCount }}</div>
            <div class="statis-name">关注</div>
          </div>
          <div class="statis-item">
            <div class="statis-num">{{ userInfo.followerCount }}</div>
            <div class="statis-name">粉丝</div>
          </div>
        </div>
      </div>
    </n-popover>
    <UserFollowGroupSelect v-model:show="showGroupSelect" :userId="userId" v-if="userInfo"/>
  </div>
</template>

<script setup lang="ts">
import {NPopover, NButton, NSpin, NDropdown, createDiscreteApi} from 'naive-ui'
import {User} from "~/types"

interface Props{
  userId: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
const currentUser = useUserInfo()
const userInfo = ref<User>()
const loading = ref(false)
const followLoading = ref(false)
const showGroupSelect = ref(false)

function handleShow(val: boolean) {
  if(val){
    getUserInfo()
  }
}
async function getUserInfo() {
  loading.value = true
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchPost('/user/' + props.userId, { })
    if(success){
      userInfo.value = result
    }else{
      message.error(msg as string)
    }
    loading.value = false
  }catch (e) {
    loading.value = false
  }
}

async function handleFollow(type: number) {
  followLoading.value = true
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchPost('/user/follow', { id: props.userId, type })
    if(success){
      getUserInfo()
    }else{
      message.error(msg as string)
    }
    followLoading.value = false
  }catch (e) {
    followLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.statis-item{
  @apply flex flex-col items-center;
  .statis-num{
    @apply font-semibold;
  }
  .statis-name{
    @apply text-gray-400;
  }
}
</style>
