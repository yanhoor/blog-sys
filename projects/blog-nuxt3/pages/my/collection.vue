<template>
  <SkeletonPostList v-if="pageLoading && pageFetchParams.page === 1"></SkeletonPostList>

  <div v-else>
    <div class="grid grid-cols-1 gap-[12px]" v-loadMore="handleLoadNextPage">
      <n-card v-for="blog of pageList" :key="blog.id">
        <PostItem :blog="blog" :comment-page-size="2"/>
      </n-card>
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
import { Blog } from '@/types'
import {
  NCard,
  NSpin
} from "naive-ui"

const myInfo = useUserInfo()
const { pageFetchParams, pageList, pageLoading, fetchResult, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<Blog>('/user/collectBlogList', { }, {})

handleLoadNextPage()

useHead(() => {
  return {
    title: `@${myInfo.value?.name}的收藏`
  }
})
</script>
