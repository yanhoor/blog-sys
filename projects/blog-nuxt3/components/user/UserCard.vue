<template>
  <div class="user-card">
    <n-popover
      trigger="hover"
      @update:show="handleShow"
      class="max-w-[280px]"
      :disabled="disabled"
    >
      <template #trigger>
        <slot name="trigger"></slot>
      </template>

      <n-spin size="small" v-if="loading" />

      <div
        class="flex flex-col items-start gap-[12px] overflow-hidden p-[12px]"
        v-else-if="userInfo"
      >
        <div
          class="flex max-w-full cursor-pointer items-center gap-[12px]"
          @click="navigateTo({ path: '/user/id/' + userInfo.id })"
        >
          <UserAvatar :user="userInfo" :size="36" disabled />
          <span class="text-[16px] text-primary">
            {{ userInfo?.name }}
          </span>
        </div>
        <UserFollowDropdown
          v-if="userInfo.isFollowing"
          @unfollow="handleFollow(2)"
          class="w-full"
          :user="userInfo"
          @selectGroup="showGroupSelect = true"
        >
          <n-button
            type="tertiary"
            class="w-full"
            size="small"
            :loading="followLoading"
            >已关注</n-button
          >
        </UserFollowDropdown>
        <n-button
          type="primary"
          class="w-full"
          size="small"
          @click="handleFollow(1)"
          :loading="followLoading"
          v-else-if="uid !== currentUser.id && uname !== currentUser.name"
          >关注</n-button
        >
        <div
          class="custom-border flex w-full items-start justify-around border-t pt-[6px]"
        >
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
      <p v-else>暂无信息</p>
    </n-popover>
    <UserFollowGroupSelect
      v-model:show="showGroupSelect"
      :userId="userInfo.id"
      v-if="userInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { NPopover, NButton, NSpin } from 'naive-ui'
import { User } from 'sys-types'

interface Props {
  uid?: string
  uname?: string
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
  if (val) {
    getUserInfo()
  }
}
async function getUserInfo() {
  loading.value = true
  const { message } = useDiscreteApi(['message'])
  try {
    const { result, success, code, msg } = await useFetchPost(
      '/user/userInfo',
      {
        uid: props.uid,
        uname: props.uname
      }
    )
    if (success) {
      userInfo.value = result
    } else {
      message.error(msg as string)
    }
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

async function handleFollow(type: number) {
  followLoading.value = true
  const { message } = useDiscreteApi(['message'])
  try {
    const { result, success, code, msg } = await useFetchPost('/user/follow', {
      id: props.uid,
      type
    })
    if (success) {
      getUserInfo()
    } else {
      message.error(msg as string)
    }
    followLoading.value = false
  } catch (e) {
    followLoading.value = false
  }
}
</script>

<style lang="postcss" scoped>
.statis-item {
  @apply flex flex-col items-center;
  .statis-num {
    @apply font-semibold;
  }
  .statis-name {
    @apply text-gray-400;
  }
}
</style>
