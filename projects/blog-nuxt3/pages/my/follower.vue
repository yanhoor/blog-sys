<template>
  <div>
    <n-card>
      <UserList url="/user/friends" :search-params="{ relateType: 2, uid: myInfo?.id }"/>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NButton,
  NIcon,
  NInput,
  NInputGroup,
  NTag,
  createDiscreteApi
} from "naive-ui"
import { User } from '@/types'

const myInfo = useUserInfo()

useHead(() => {
  return {
    title: `@${myInfo.value?.name}的全部粉丝`
  }
})
</script>
