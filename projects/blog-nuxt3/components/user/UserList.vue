<template>
  <div class="user-list">
    <SkeletonUserList v-if="pageLoading && pageFetchParams.page === 1"></SkeletonUserList>

    <div class="space-y-[12px]" v-loadMore="handleLoadNextPage">
      <div class="flex items-center gap-[12px]" v-for="user of pageList" :key="user.id">
        <UserAvatar :user="user" :size="42"></UserAvatar>
        <div class="flex-1 flex flex-col items-start self-start gap-[3px]">
          <span class="text-green-700 cursor-pointer" @click="navigateTo({ path: '/user/' + user.id })">{{ user.name }}</span>
          <span class="text-gray-400 text-[12px] dark:text-gray-600">{{ user.introduce || '暂无介绍' }}</span>
          <span class="text-gray-400 text-[12px] dark:text-gray-600" v-if="user.followersCount">粉丝：{{ user.followersCount }}</span>
        </div>
        <n-button round type="primary" size="small" @click="handleFollow(user)" :loading="followLoading" v-if="!user.isFollowing && user.id !== me.id">关注
          <template #icon>
            <n-icon :component="Add24Regular"></n-icon>
          </template>
        </n-button>
      </div>
    </div>
    <div class="text-center mt-[20px]" v-if="pageLoading">
      <n-spin :size="24"/>
    </div>
    <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)"/>
    <ResultEmpty v-else-if="pageList.length === 0" @refresh="handleLoadNextPage(1)"/>
    <ResultNoMore v-else-if="pageLoadedFinish"/>
  </div>
</template>

<script setup lang="ts">
import {User} from '@/types'
import {
  NButton,
  NTime,
  NCollapseTransition,
  NIcon,
  NSpin,
  createDiscreteApi
} from "naive-ui"
import { Add24Regular, ZoomIn24Regular, Edit20Filled } from '@vicons/fluent'

interface Props{
  blogId: number | string
}

const props = defineProps<Props>()
const me = useUserInfo()
const followLoading = ref(false)
const { pageList, pageLoading,fetchResult, pageFetchParams, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<User>('/blog/likeList', { id: props.blogId }, { })

handleLoadNextPage()

async function handleFollow(user: User) {
  followLoading.value = true
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchPost('/user/follow', { id: user.id, type: 1 })
    if(success){
      user.isFollowing = true
    }else{
      message.error(msg as string)
    }
    followLoading.value = false
  }catch (e) {
    followLoading.value = false
  }
}

defineExpose({
  handleLoadNextPage
})
</script>
