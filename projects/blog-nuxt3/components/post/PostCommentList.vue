<template>
  <div v-loadMore="allowLoadMore ? handleLoadNextPage : null">
    <CommentForm
      class="flex-1"
      :blogId="blog.id as number"
      @success="handleAddComment"
    />
    <div class="flex gap-[12px] text-[16px]">
      <span
        class="cursor-pointer"
        :class="{ 'text-primary': sortType === 1 }"
        @click="handleChangeSortType(1)"
        >按时间</span
      >
      <span
        class="cursor-pointer"
        :class="{ 'text-primary': sortType === 2 }"
        @click="handleChangeSortType(2)"
        >按热度</span
      >
    </div>
    <CommentItem
      v-for="comment of pageList"
      :key="comment.id"
      class="py-[12px]"
      :comment="comment"
      @commentDelete="handleCommentDelete"
    />
    <ResultLoading v-if="pageLoading" />
    <div class="text-center" v-else-if="!allowLoadMore && pageTotal > pageSize">
      <n-divider />
      <n-button text @click="navigateTo(`/post/${blog.id}#comment`)"
        >查看全部 {{ pageTotal }} 条评论</n-button
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
import { Comment, Blog } from 'sys-types'
import { NButton, NDivider } from 'naive-ui'

interface Props {
  blog: Blog
  pageSize?: number
  allowLoadMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowLoadMore: false
})
const sortType = ref(2) // 1--按时间，2--按热度

const {
  pageList,
  pageLoading,
  fetchResult,
  pageLoadedFinish,
  pageTotal,
  handleChangeFetchParams,
  handleLoadNextPage
} = useListAppendFetch<Comment>(
  '/comment/list',
  { blogId: props.blog.id, pageSize: props.pageSize || 20 },
  { uniqueKey: 'id' }
)

handleLoadNextPage(1)

function handleAddComment(c: Comment) {
  c.childComments = []
  pageList.value.unshift(c)
}

function handleCommentDelete(comment: Comment) {
  const index = pageList.value.findIndex((c) => c.id === comment.id)
  if (index > -1) pageList.value.splice(index, 1)
}

function handleChangeSortType(type: number) {
  if (sortType.value === type) return

  sortType.value = type
  handleChangeFetchParams({ sort: sortType.value })
}

defineExpose({
  handleLoadNextPage
})
</script>
