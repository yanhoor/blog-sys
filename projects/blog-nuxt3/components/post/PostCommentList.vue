<template>
  <div>
    <div class="flex items-start pb-[20px]" v-if="userInfo">
      <UserAvatar class="mr-[12px]" :user="userInfo" size="small"></UserAvatar>
      <CommentForm class="flex-1" :blogId="blog.id" :level="1" @success="handleCommentCommit"/>
    </div>
    <div class="text-center mt-[20px]" v-if="pageLoading">
      <n-spin :size="24"/>
    </div>
    <template v-else>
      <template v-for="comment of pageList" :key="comment.id">
        <CommentItem :comment="comment" @commentDelete="handleCommentDelete" :allowLoadMoreReply="false"/>
      </template>
      <n-divider/>
      <div class="text-center">
        <n-button text>查看全部 {{ pageTotal }} 条评论</n-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import {
  NSpin,
  NButton,
  NDivider,
} from "naive-ui"

interface Props{
  blog: Blog
  pageSize: number
}

const props = defineProps<Props>()
const userInfo = useUserInfo()

const { pageFetchParams, pageList, pageLoading, pageTotal, handleLoadNextPage } = useListAppendFetch<Comment>('/comment/list', { blogId: props.blog.id, pageSize: props.pageSize }, { uniqueKey: 'id' })
handleLoadNextPage()

function handleCommentCommit(c: Comment) {
  pageList.value.unshift(c)
}

function handleCommentDelete(comment: Comment) {
  const index = pageList.value.findIndex(c => c.id === comment.id)
  if(index > -1) pageList.value.splice(index, 1)
}
</script>
