<template>
  <div>
    <el-popover
        trigger="hover"
        @show="handleShow"
        class="max-w-[280px]"
        :show-after="500"
        :disabled="disabled"
    >
      <template #reference>
        <slot name="trigger"></slot>
      </template>

      <div class="h-[64px] w-[64px]" v-loading v-if="loading"></div>

      <div
          class="flex flex-col items-start gap-[12px] p-[12px] font-normal"
          v-else-if="currentUser"
      >
        <div
            class="flex max-w-full cursor-pointer items-center gap-[6px]"
            @click="navigateTo({ path: '/user/id/' + currentUser.id })"
        >
          <UserAvatar :user="currentUser" :size="36" disabled />
          <UserName
              class="text-[16px]"
              :user="currentUser"
              disabled
          ></UserName>
        </div>
        <UserFollowDropdown
            @updateFollow="getUserInfo()"
            class="w-full text-center"
            :roundBtn="false"
            :user="currentUser"
        >
        </UserFollowDropdown>
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
    </el-popover>
  </div>
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
    const { result, success, code, msg } = await useFetchPost(
      '/user/userInfo',
      {
        uid: props.uid,
        uname: props.uname
      }
    )
    if (success) {
      currentUser.value = result
    } else {
      ElMessage.error(msg as string)
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
