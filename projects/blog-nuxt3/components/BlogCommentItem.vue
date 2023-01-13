<template>
  <div class="flex items-start pt-[20px] mb-[12px]">
    <UserAvatar :user="comment.createBy" :size="level === 1 ? 'medium' : 'small'"></UserAvatar>
    <div class="comment-right-container flex-1 ml-[12px] flex flex-col items-start gap-[6px] w-0 group">
      <div class="flex items-center gap-[12px]">
        <div class="cursor-pointer flex items-center gap-[12px]" @click="navigateTo({ path: '/user/' + comment.createById })">
          <div class="font-semibold">
            <span :class="{ 'text-[20px]': level === 1}">{{ comment.createBy?.name }}</span>
            <span v-if="comment.createById === blog.createById">
              (作者)
            </span>
          </div>
          <n-tooltip trigger="hover" v-if="level === 1">
            <template #trigger>
              <span class="text-gray-400 max-w-[180px] truncate">{{ comment.createBy.sign }}</span>
            </template>
            {{ comment.createBy.sign }}
          </n-tooltip>
        </div>

        <template v-if="comment.replyComment?.topCommentId">
          <span class="text-gray-500">回复</span>
          <div class="font-semibold cursor-pointer" @click="navigateTo({ path: '/user/' + comment.replyTo.id })">
            {{ comment.replyTo?.name }}
          </div>
        </template>
      </div>

      <div>{{ comment.content }}</div>

      <div class="text-gray-500 py-[3px] px-[6px] border custom-border rounded truncate max-w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300" v-if="comment.replyComment?.topCommentId && comment.replyComment?.content">{{ comment.replyComment?.content }}</div>

      <div class="flex items-center justify-between w-full">
        <div class="flex items-center flex-1">
          <n-time class="mr-[12px]" type="relative" :time="new Date(comment.createdAt)"></n-time>
          <n-button text @click="triggerReply" v-if="userInfo">
            <template #icon>
              <n-icon :component="showReply ? Chat24Filled : Chat24Regular" />
            </template>
            {{ showReply ? '取消回复' : '回复' }}
          </n-button>
        </div>
        <n-button class="hidden group-hover:block" text type="error" @click="handleDeleteComment" :loading="commentDeleting" v-if="props.comment?.createById === userInfo.id">删除</n-button>
      </div>

      <n-collapse-transition :show="showReply">
        <CommentForm
          btnText="发布"
          :placeholder="`回复 ${comment.createBy.name}:`"
          :level="props.level + 1"
          :comment="comment"
          :blogId="comment.blogId"
          @success="handleReplySuccess"
        />
      </n-collapse-transition>

      <!--评论的回复-->
      <div class="reply-container bg-content-light dark:bg-content-dark rounded-[5px] min-w-full">
        <template v-for="reply of pageList" :key="reply.id">
          <BlogCommentItem class="p-[12px] pb-0 mb-0" :comment="reply" @replyCommit="handleReplyCommit" :level="props.level + 1" :blog="blog" @commentDelete="handleCommentDelete"/>
        </template>
        <n-button
          class="ml-[12px] mb-[12px]"
          text
          type="primary"
          icon-placement="right"
          v-if="!props.comment.topCommentId && props.comment._count.childComments > 2 && !pageLoadedFinish"
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
import { Comment, Blog } from '@/types'
import {
  NTooltip,
  NButton,
  NTime,
  NCollapseTransition,
  NIcon, createDiscreteApi
} from "naive-ui"
import { Chat24Regular, Chat24Filled, ArrowCircleDown24Regular } from '@vicons/fluent'
import websocket from "~/websocket";

// 如果 props.comment.topCommentId 存在，props.comment 就是评论的回复，即当前组件在第二层
interface Props{
  comment: Comment
  blog: Blog
  level: number // 属于第几级评论
}

const props = defineProps<Props>()
const userInfo = useUserInfo()
const showReply = ref(false)
const commentDeleting = ref(false)
const { currentPage, pageList, pageLoading, pageLoadedFinish, handlePageChange } = useListAppendFetch<Comment>('/comment/replyList', { blogId: props.comment.blogId, topCommentId: props.comment.id }, { initList: props.comment.childComments, pageSize: 10, uniqueKey: 'id' })

const emit = defineEmits(['replyCommit', 'commentDelete'])

function triggerReply() {
  showReply.value = !showReply.value
}

function handleReplySuccess(reply: Comment){
  if(props.level === 1){
    pageList.value.push(reply)
  }else{
    emit('replyCommit', reply)
  }
  showReply.value = false
}

function handleReplyCommit(reply: Comment){
  pageList.value.push(reply)
}

function handleCommentDelete(comment: Comment) {
  const index = pageList.value.findIndex(c => c.id === comment.id)
  if(index > -1) pageList.value.splice(index, 1)
}

async function handleDeleteComment() {
  const { message, dialog } = createDiscreteApi(["message", "dialog"])
  dialog.error({
    title: '删除',
    content: '确定删除该评论？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try{
        commentDeleting.value = true
        const { result, success, msg } = await useFetchPost('/comment/delete', {
          id: props.comment.id
        })
        commentDeleting.value = false
        if(success){
          message.success('删除成功')
          emit('commentDelete', props.comment)
        }else{
          message.error(msg as string)
        }
      }catch (e) {
        commentDeleting.value = false
        console.log('=====/comment/delete=======', e)
      }
    },
    onNegativeClick: () => {

    }
  })
}

</script>
