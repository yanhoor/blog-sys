<template>
  <div v-loadMore="allowLoadMore ? handleLoadNextPage : null">
    <PostTransfer
      class="w-full"
      :blog="blog"
      @success="handleRetweetSuccess"
    ></PostTransfer>
    <div v-auto-animate>
      <PostRetweetItem
        class="w-full py-[12px]"
        :blog="retweetItem"
        v-for="(retweetItem, index) of pageList"
        @delete="handleDeleteRetweet(index)"
        :key="retweetItem.id"
      ></PostRetweetItem>
    </div>
    <ResultLoading v-if="pageLoading" />
    <div class="text-center" v-else-if="!allowLoadMore && pageTotal > 20">
      <n-divider />
      <n-button text @click="navigateTo(`/post/${blog.id}#retweet`)"
        >查看全部 {{ pageTotal }} 条转发</n-button
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
import { Blog } from 'sys-types'
import { NButton, NDivider } from 'naive-ui'

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
</script>
