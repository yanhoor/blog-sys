<template>
  <virtual-el-popover
    trigger="hover"
    class="inline-block max-w-[280px]"
    :show-after="500"
    :teleported="false"
    :disabled="disabled"
    @show="handleShow"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>

    <div v-if="loading" v-loading class="h-[64px] w-[64px]" />

    <div
      v-else-if="currentUser"
      class="flex flex-col items-start gap-[12px] p-[12px] font-normal"
    >
      <div
        class="flex w-full cursor-pointer items-center justify-center gap-[6px]"
        @click="navigateTo({ path: '/user/id/' + currentUser.id })"
      >
        <UserAvatar :user="currentUser" :size="36" disabled />
        <UserName class="text-[16px]" :user="currentUser" disabled />
      </div>
      <UserFollowDropdown
        v-if="myInfo"
        class="w-full text-center"
        :round-btn="false"
        :user="currentUser"
        @update-follow="getUserInfo()"
      />
      <div
        class="custom-border flex w-full items-start justify-around border-t pt-[6px]"
      >
        <div class="statis-item">
          <div class="font-semibold">{{ currentUser.followingCount }}</div>
          <div class="secondary-text-color">关注</div>
        </div>
        <div class="statis-item">
          <div class="font-semibold">{{ currentUser.followerCount }}</div>
          <div class="secondary-text-color">粉丝</div>
        </div>
      </div>
    </div>
    <p v-else>暂无信息</p>
  </virtual-el-popover>
</template>

<script setup lang="ts">
interface Props {
  uid?: string
  uname?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
const { $HttpUtils } = useNuxtApp()
const myInfo = useUserInfo()
const loading = ref(false)
const currentUser = ref()

function handleShow(val: boolean) {
  if (val) {
    getUserInfo()
  }
}

async function getUserInfo() {
  loading.value = true
  try {
    const { result, success, code, msg } = await $HttpUtils.post(
      '/user/userInfo',
      {
        uid: props.uid,
        uname: props.uname
      }
    )
    if (success) {
      currentUser.value = result
    }
    loading.value = false
  } catch (e) {
    loading.value = false
    console.log('=====getUserInfo========', e)
  }
}
</script>

<style lang="postcss" scoped>
.statis-item {
  @apply flex flex-col items-center gap-[8px] text-[14px];
}
</style>
