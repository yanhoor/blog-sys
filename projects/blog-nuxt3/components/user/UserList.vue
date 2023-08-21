<template>
  <div class="user-list">
    <SkeletonUserList
      v-if="pageLoading && pageFetchParams.page === 1"
    ></SkeletonUserList>

    <div class="space-y-[12px]" v-loadMore="handleLoadNextPage">
      <div
        class="flex items-center gap-[12px]"
        v-for="user of pageList"
        :key="user.id"
      >
        <UserAvatar :user="user" :size="42"></UserAvatar>
        <div class="flex-1 flex flex-col items-start self-start gap-[3px]">
          <span
            class="text-green-700 cursor-pointer"
            @click="navigateTo({ path: '/user/' + user.id })"
            >{{ user.name }}</span
          >
          <span class="text-gray-400 text-[12px] dark:text-gray-600">{{
            user.introduce || '暂无介绍'
          }}</span>
          <span
            class="text-gray-400 text-[12px] dark:text-gray-600"
            v-if="user.followerCount"
            >粉丝：{{ user.followerCount }}</span
          >
        </div>
        <UserFollowDropdown :user="user" @update="handleLoadNextPage(1)" />
      </div>
    </div>
    <ResultLoading v-if="pageLoading" />
    <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)" />
    <ResultEmpty
      v-else-if="pageList.length === 0"
      @refresh="handleLoadNextPage(1)"
    />
    <ResultNoMore v-else-if="pageLoadedFinish" />
  </div>
</template>

<script setup lang="ts">
import { User } from 'sys-types'
import { NSpin } from 'naive-ui'

interface Props {
  url: string
  searchParams?: any
}

const props = defineProps<Props>()
const myInfo = useUserInfo()
const {
  pageList,
  pageLoading,
  fetchResult,
  pageFetchParams,
  pageLoadedFinish,
  handleLoadNextPage
} = useListAppendFetch<User>(props.url, props.searchParams || {}, {})

handleLoadNextPage(1)

defineExpose({
  handleLoadNextPage
})
</script>
