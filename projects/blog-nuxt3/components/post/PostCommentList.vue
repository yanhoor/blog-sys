<template>
  <div v-loadMore="allowLoadMore ? handleLoadNextPage : null">
    <div class="flex items-start pb-[20px]" v-if="userInfo">
      <UserAvatar class="mr-[12px]" :user="userInfo" size="small"></UserAvatar>
      <CommentForm
        class="flex-1"
        :blogId="blog.id"
        :level="1"
        @success="handleCommentCommit"
      />
    </div>
    <template v-for="comment of pageList" :key="comment.id">
      <CommentItem :comment="comment" @commentDelete="handleCommentDelete" />
    </template>
    <ResultLoading v-if="pageLoading" />
    <div class="text-center" v-else-if="!allowLoadMore && pageTotal > pageSize">
      <n-divider />
      <n-button text @click="navigateTo(`/post/${blog.id}`)"
        >查看全部 {{ pageTotal }} 条评论</n-button
      >
      <!--<n-button text type="primary" @click="handleLoadNextPage">查看更多</n-button>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment, Blog } from 'sys-types'
import { NSpin, NButton, NDivider } from 'naive-ui'

interface Props {
  blog: Blog
  pageSize?: number
}

provide('allow_load_more_reply', false)
const allowLoadMore = inject('allow_load_more_comment', false)
const props = defineProps<Props>()
const userInfo = useUserInfo()

const {
  pageFetchParams,
  pageList,
  pageLoading,
  pageTotal,
  handleLoadNextPage
} = useListAppendFetch<Comment>(
  '/comment/list',
  { blogId: props.blog.id, pageSize: props.pageSize || 20 },
  { uniqueKey: 'id' }
)

handleLoadNextPage(1)

function handleCommentCommit(c: Comment) {
  pageList.value.unshift(c)
}

function handleCommentDelete(comment: Comment) {
  const index = pageList.value.findIndex((c) => c.id === comment.id)
  if (index > -1) pageList.value.splice(index, 1)
}

defineExpose({
  handleLoadNextPage
})
</script>
