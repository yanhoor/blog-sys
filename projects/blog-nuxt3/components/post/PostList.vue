<template>
  <SkeletonPostList v-if="pageLoading && pageFetchParams.page === 1"></SkeletonPostList>

  <div v-else>
    <div class="grid grid-cols-1 gap-[12px]" v-loadMore="handleLoadMore">
      <template v-for="(blog, index) of pageList">
        <n-card>
          <PostItem :blog="blog" :comment-page-size="2" v-bind="$attrs" @delete="handlePostDelete(index)"/>
        </n-card>
      </template>
    </div>
    <div class="text-center mt-[20px]" v-if="pageLoading">
      <n-spin :size="24"/>
    </div>
    <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)"/>
    <ResultEmpty v-else-if="pageList.length === 0" @refresh="handleLoadNextPage(1)"/>
    <ResultNoMore v-else-if="pageLoadedFinish"/>
    <n-back-top :right="50"/>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NBackTop,
  NSpin
} from "naive-ui"
import { Blog } from '@/types'

interface Props {
  searchParams?: {
    keyword?: string
    time?: string
    sort?: string
    uid?: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['fetchComplete'])
provide('allow_load_more_comment', false)
const fetchNewPost = useFetchNewPost()
const route = useRoute()
const userInfo = useUserInfo()
const { pageFetchParams, pageList, pageLoading, fetchResult, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<Blog>('/blog/list', props.searchParams, {})

handleLoadNextPage().then(r => {
  emit('fetchComplete', fetchResult)
})

watch(fetchNewPost, (val) => {
  if(val && route.fullPath === '/'){
    pageList.value.unshift(val as Blog)
  }
})

function handleLoadMore() {
  // console.log('----------handleLoadMore-----------')
  handleLoadNextPage()
  return pageLoadedFinish.value
}

function handlePostDelete(idx: number) {
  pageList.value.splice(idx, 1)
}
</script>

