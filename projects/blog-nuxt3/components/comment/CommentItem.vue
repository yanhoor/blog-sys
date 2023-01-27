<template>
  <div class="flex items-start pt-[20px] mb-[12px]">
    <UserAvatar :user="comment.createBy" :size="24"></UserAvatar>
    <div class="comment-right-container flex-1 ml-[12px] flex flex-col items-start gap-[6px] w-0 group">
      <div class="flex items-center">
        <div class="cursor-pointer text-green-700" @click="navigateTo({ path: '/user/' + comment.createById })">
          {{ comment.createBy?.name }}
        </div>
      </div>

      <ExpandableContent :content="comment.content" :max-length="160"/>

      <div class="flex items-center justify-between w-full">
        <div class="flex items-center flex-1">
          <n-time class="mr-[12px]" type="datetime" :time="new Date(comment.createdAt)"></n-time>
          <n-button text @click="triggerReply" v-if="userInfo">
            <template #icon>
              <n-icon :component="showReply ? Chat24Filled : Chat24Regular" />
            </template>
            {{ showReply ? '取消回复' : '回复' }}
          </n-button>
        </div>
        <n-button class="hidden group-hover:block" text type="error" @click="handleDeleteComment" :loading="commentDeleting" v-if="props.comment?.createById === userInfo?.id">删除</n-button>
      </div>

      <n-collapse-transition :show="showReply">
        <CommentForm
          btnText="发布"
          :placeholder="`回复 ${comment.createBy.name}:`"
          :level="2"
          :comment="comment"
          :blogId="comment.blogId"
          @success="handleReplySuccess"
        />
      </n-collapse-transition>

      <CommentReplyList ref="replyListRef" :comment="comment" @checkReply="handleCheckReply"/>
    </div>
  </div>
  <CommentReplyModal :comment="comment" v-model:show="showReplyDetailList"/>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import {
  NButton,
  NTime,
  NCollapseTransition,
  NIcon, createDiscreteApi
} from "naive-ui"
import { Chat24Regular, Chat24Filled, ArrowCircleDown24Regular } from '@vicons/fluent'

// 如果 props.comment.topCommentId 存在，props.comment 就是评论的回复，即当前组件在第二层
interface Props{
  comment: Comment
}

const props = defineProps<Props>()
const userInfo = useUserInfo()
const showReply = ref(false)
const commentDeleting = ref(false)
const replyListRef = ref()
const showReplyDetailList = ref(false)

const emit = defineEmits(['commentDelete'])

function triggerReply() {
  showReply.value = !showReply.value
}

function handleCheckReply() {
  showReplyDetailList.value = true
}

function handleReplySuccess(reply: Comment){
  replyListRef.value.handleReplyCommit(reply)
  showReply.value = false
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
