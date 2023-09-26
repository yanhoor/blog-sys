<template>
  <div class="user-list">
    <SkeletonUserList
      v-if="pageLoading && pageFetchParams.page === 1"
    ></SkeletonUserList>

    <div class="space-y-[12px]" v-loadMore="handleLoadNextPage" v-auto-animate>
      <div
        class="flex items-center gap-[12px]"
        v-for="user of pageList"
        :key="user.id"
      >
        <UserAvatar :user="user" :size="42"></UserAvatar>
        <div class="flex flex-1 flex-col items-start gap-[3px] self-start">
          <UserName :user="user"></UserName>
          <span class="secondary-text-color text-[12px]">{{
            user.introduce || '暂无介绍'
          }}</span>
          <span
            class="secondary-text-color text-[12px]"
            v-if="user.followerCount"
            >粉丝：{{ user.followerCount }}</span
          >
        </div>
        <UserFollowDropdown
          :user="user"
          @updateFollow="handleLoadNextPage(1)"
        />
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
