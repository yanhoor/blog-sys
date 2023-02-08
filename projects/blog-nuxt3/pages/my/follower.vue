<template>
  follower
</template>

<script setup lang="ts">
import { User } from '@/types'

const myInfo = useUserInfo()
const { pageFetchParams, pageList, pageLoading, fetchResult, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<User>('/user/friends', { relateType: 2, uid: myInfo.value?.id }, {})

handleLoadNextPage()

useHead(() => {
  return {
    title: `@${myInfo.value?.name}的全部粉丝`
  }
})
</script>
