<template>
  <div class="px-[12px] bg-content-light dark:bg-content-dark rounded-[5px] min-w-full" v-loadMore="allowLoadMore ? { handler: handleLoadNextPage, scrollElSelector: '#replyModalContent' } : null">
    <div class="flex items-start pt-[20px]" v-for="reply of pageList">
      <UserAvatar :user="reply.createBy" :size="24"></UserAvatar>
      <div class="comment-right-container flex-1 ml-[12px] flex flex-col items-start gap-[6px] w-0 group">
        <div class="flex items-center">
          <div class="cursor-pointer text-green-700" @click="navigateTo({ path: '/user/' + reply.createById })">
            {{ reply.createBy?.name }}
          </div>

          <template v-if="reply.replyComment?.topCommentId">
            <span class="text-gray-500 mx-[6px]">回复</span>
            <div class="cursor-pointer text-green-700" @click="navigateTo({ path: '/user/' + reply.replyTo.id })">
              @{{ reply.replyTo?.name }}
            </div>
          </template>
        </div>

        <ExpandableContent :content="reply.content" :max-length="160"/>

        <div class="text-gray-500 py-[3px] px-[6px] border custom-border rounded truncate max-w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300" v-if="reply.replyComment?.topCommentId">{{ reply.replyComment?.content }}</div>

        <div class="flex items-center justify-between w-full">
          <div class="flex items-center flex-1">
            <n-time class="mr-[12px]" type="datetime" format="yyyy-MM-dd HH:mm" :time="new Date(reply.createdAt)"></n-time>
            <n-button text @click="reply.showReply = !reply.showReply" v-if="userInfo">
              <template #icon>
                <n-icon :component="reply.showReply ? Chat24Filled : Chat24Regular" />
              </template>
              {{ reply.showReply ? '取消回复' : '回复' }}
            </n-button>
          </div>
          <n-button class="hidden group-hover:block" text type="error" @click="handleDeleteComment(reply)" :loading="commentDeleting" v-if="reply?.createById === userInfo?.id">删除</n-button>
        </div>

        <n-collapse-transition :show="!!reply.showReply">
          <CommentForm
            btnText="发布"
            :placeholder="`回复 ${reply.createBy.name}:`"
            :level="2"
            :comment="reply"
            :blogId="reply.blogId"
            @success="handleReplySuccess"
          />
        </n-collapse-transition>
      </div>
    </div>

    <div class="text-center my-[20px]" v-if="allowLoadMore">
      <n-spin :size="24" v-if="pageLoading"/>
    </div>

    <n-button
      class="ml-[12px] mb-[12px]"
      text
      type="primary"
      icon-placement="right"
      v-else-if="!comment.topCommentId && comment._count?.childComments > 2"
      @click="emit('checkReply')"
    >
      共 {{ comment._count?.childComments }} 条回复
      <template #icon>
        <n-icon :component="ChevronDown24Filled"/>
      </template>
    </n-button>

  </div>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import {
  NButton,
  NTime,
  NCollapseTransition,
  NIcon,
  NSpin,
  createDiscreteApi
} from "naive-ui"
import { Chat24Regular, Chat24Filled, ChevronDown24Filled } from '@vicons/fluent'

interface CommentType extends Comment{
  showReply?: boolean
}
// 如果 props.comment.topCommentId 存在，props.comment 就是评论的回复，即当前组件在第二层
interface Props{
  comment: CommentType
}

const allowLoadMore = inject('allow_load_more_reply', false) // 是否允许加载更多回复还是弹窗显示回复列表
const props = defineProps<Props>()
const emit = defineEmits(['checkReply'])
const userInfo = useUserInfo()
const commentDeleting = ref(false)
const { pageList, pageLoading, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<Comment>('/comment/replyList', { blogId: props.comment.blogId, topCommentId: props.comment.id }, { initList: allowLoadMore ? [] : props.comment.childComments, pageSize: 10, uniqueKey: 'id' })

if(allowLoadMore){
  handleLoadNextPage()
}

function handleReplySuccess(reply: CommentType){
  pageList.value.push(reply)
  reply.showReply = false
}

// 暴露给父组件调用
function handleReplyCommit(reply: Comment){
  pageList.value.push(reply)
}

function handleCommentDelete(comment: Comment) {
  const index = pageList.value.findIndex(c => c.id === comment.id)
  if(index > -1) pageList.value.splice(index, 1)
}

async function handleDeleteComment(reply: Comment) {
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
          id: reply.id
        })
        commentDeleting.value = false
        if(success){
          message.success('删除成功')
          handleCommentDelete(reply)
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

defineExpose({
  handleReplyCommit
})
</script>
