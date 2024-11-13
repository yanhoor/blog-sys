<template>
  <div v-loadMore="allowLoadMore ? handleLoadNextPage : null">
    <PostTransfer class="w-full" :blog="blog" @success="handleRetweetSuccess" />
    <div v-auto-animate>
      <PostRetweetItem
        v-for="(retweetItem, index) of pageList"
        :key="retweetItem.id"
        class="w-full py-[12px]"
        :blog="retweetItem"
        @delete="handleDeleteRetweet(index)"
      />
    </div>
    <ResultLoading v-if="pageLoading" />
    <div v-else-if="!allowLoadMore && pageTotal > 20" class="text-center">
      <el-divider />
      <el-button text @click="navigateTo(`/post/${blog.id}#retweet`)"
        >查看全部 {{ pageTotal }} 条转发</el-button
      >
    </div>
    <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)" />
    <ResultEmpty
      v-else-if="pageList.length === 0"
      @refresh="handleLoadNextPage(1)"
    />
    <ResultNoMore v-else-if="pageLoadedFinish" />
  </div>
</template>

<script setup lang="ts">
import type { Blog } from 'sys-types'

interface Props {
  blog: Blog
  allowLoadMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowLoadMore: false
})
const {
  pageList,
  pageLoading,
  fetchResult,
  pageLoadedFinish,
  pageTotal,
  handleLoadNextPage
} = useListAppendFetch<Blog>('/blog/retweetList', { blogId: props.blog.id }, {})

handleLoadNextPage(1)

function handleDeleteRetweet(index: number) {
  pageList.value.splice(index, 1)
}

function handleRetweetSuccess(res: Blog) {
  pageList.value.unshift(res)
}

defineExpose({
  handleLoadNextPage
})
</script>
