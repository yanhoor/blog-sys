<template>
  <SkeletonIndex v-if="pageLoading && pageFetchParams.page === 1"></SkeletonIndex>

  <div v-else>
    <div class="grid grid-cols-1 gap-[12px]" v-loadMore="handleLoadMore">
      <template v-for="blog of pageList">
        <n-card>
          <PostItem :blog="blog" :comment-page-size="2"/>
        </n-card>
      </template>
    </div>
    <div class="text-center mt-[20px]" v-if="pageLoading">
      <n-spin :size="24"/>
    </div>
    <n-back-top :right="50"/>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NBackTop,
  NSpin,
  createDiscreteApi
} from "naive-ui"
import { Blog } from '@/types'

interface Props {
  canEdit?: boolean // 是否能编辑文章
  searchParams?: {
    keyword?: string
    time?: string
    sort?: string
    uid?: string
  }
}

const props = defineProps<Props>()
provide('allow_load_more_comment', false)
const fetchNewPost = useFetchNewPost()
const route = useRoute()
const userInfo = useUserInfo()
const { pageFetchParams, pageList, pageLoading, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<Blog>('/blog/list', props.searchParams, {})
handleLoadNextPage()

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
</script>

