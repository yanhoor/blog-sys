<template>
  <div class="flex items-start pt-[20px] mb-[12px]">
    <UserAvatar :user="comment.createBy"></UserAvatar>
    <div class="comment-right-container flex-1 ml-[12px] flex flex-col items-start">
      <div class="cursor-pointer flex items-center gap-[12px]" @click="navigateTo({ path: '/user/' + comment.createBy.id })">
        <span class="text-[20px] font-semibold">{{ comment.createBy?.name }}</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <span class="text-gray-400 max-w-[180px] truncate">{{ comment.createBy.sign }}</span>
          </template>
          {{ comment.createBy.sign }}
        </n-tooltip>
      </div>
      <span class="my-[12px] mx-0">
        <span v-if="comment.replyTo" class="cursor-pointer mr-[5px] text-green-600">@{{ comment.replyTo.name }}</span>
        <span>{{ comment.content }}</span>
      </span>
      <div class="flex items-center">
        <n-time class="mr-[12px]" type="relative" :time="new Date(comment.createdAt)"></n-time>
        <n-button text @click="triggerReply" v-if="userInfo">
          <template #icon>
            <n-icon :component="showReply ? Chat24Filled : Chat24Regular" />
          </template>
          {{ showReply ? '取消回复' : '回复' }}
        </n-button>
      </div>
      <n-collapse-transition :show="showReply">
        <CommentForm
          btnText="发布"
          :placeholder="`回复 ${comment.createBy.name}:`"
          :replyTo="comment.createBy"
          :replyCommentId="comment.replyCommentId || comment.id"
          :blogId="comment.blogId"
          @success="handleReplySuccess"
        />
      </n-collapse-transition>

      <!--评论的回复-->
      <div class="reply-container bg-content-light dark:bg-content-dark rounded-[5px] mt-[12px] min-w-full">
        <template v-for="reply of pageList" :key="reply.id">
          <BlogCommentItem class="p-[12px] pb-0" :comment="reply" @replyCommit="handleReplyCommit"/>
        </template>
        <n-button
          class="ml-[12px] mb-[12px]"
          text
          type="primary"
          icon-placement="right"
          v-if="!props.comment.replyCommentId && props.comment._count.replyItems > 2 && !pageLoadedFinish"
          @click="handlePageChange(currentPage + 1)"
          :loading="pageLoading"
        >
          查看更多回复
          <template #icon>
            <n-icon :component="ArrowCircleDown24Regular"/>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment } from '@/types'
import {
  NTooltip,
  NButton,
  NTime,
  NCollapseTransition,
  NIcon
} from "naive-ui"
import { Chat24Regular, Chat24Filled, ArrowCircleDown24Regular } from '@vicons/fluent'

// 如果 props.comment.replyCommentId 存在，props.comment 就是评论的回复，即当前组件在第二层
interface Props{
  comment: Comment
}

const props = defineProps<Props>()
const userInfo = useUserInfo()
const showReply = ref(false)
const { currentPage, pageList, pageLoading, pageLoadedFinish, handlePageChange } = useListAppendFetch<Comment>('/comment/replyList', { blogId: props.comment.blogId, replyCommentId: props.comment.id }, { initList: props.comment.replyItems, pageSize: 10, uniqueKey: 'id' })

const emit = defineEmits(['replyCommit'])

function triggerReply() {
  showReply.value = !showReply.value
}

function handleReplySuccess(reply: Comment){
  emit('replyCommit', reply)
  showReply.value = false
}

function handleReplyCommit(reply: Comment){
  pageList.value.push(reply)
}

</script>
