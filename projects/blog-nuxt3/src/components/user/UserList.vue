<template>
  <div class="user-list">
    <SkeletonUserList v-if="pageLoading && pageFetchParams.page === 1" />

    <div v-loadMore="handleLoadNextPage" v-auto-animate class="space-y-[12px]">
      <div
        v-for="user of pageList"
        :key="user.id"
        class="flex items-center gap-[12px]"
      >
        <UserAvatar :user="user" :size="42" />
        <div class="flex flex-1 flex-col items-start gap-[3px] self-start">
          <UserName :user="user" />
          <span class="secondary-text-color text-[12px]">{{
            user.introduce || '暂无介绍'
          }}</span>
          <span
            v-if="user.followerCount"
            class="secondary-text-color text-[12px]"
            >粉丝：{{ user.followerCount }}</span
          >
        </div>
        <UserFollowDropdown
          :user="user"
          @update-follow="handleLoadNextPage(1)"
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
import type { User } from 'sys-types'

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
