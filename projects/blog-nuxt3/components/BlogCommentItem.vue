<template>
  <div class="comment-container" ref="commentRef">
    <UserAvatar :src="comment.createBy.avatar"></UserAvatar>
    <div class="comment-right-container">
      <span class="user-name">{{ comment.createBy.name }}</span>
      <span class="content">
        <span v-if="comment.replyTo" class="at-user">@{{ comment.replyTo.name }}</span>
        <span>{{ comment.content }}</span>
      </span>
      <div class="action-container">
        <n-time class="comment-time" type="relative" :time="new Date(comment.createdAt)"></n-time>
        <n-button text @click="triggerReply">
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

      <div class="reply-container">
        <template v-for="reply of replyList" :key="reply.id">
          <BlogCommentItem :comment="reply" @refresh="handleRefresh"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment } from '@/types'
import {
  NAvatar,
  NButton,
  NTime,
  NCollapseTransition,
  NIcon
} from "naive-ui"
import { Chat24Regular, Chat24Filled } from '@vicons/fluent'

// 如果 props.comment.replyCommentId 存在，props.comment 就是评论的回复，即当前组件在第二层
interface Props{
  comment: Comment
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const userInfo = useUserInfo()
const showReply = ref(false)
const commentRef = ref<HTMLElement>()
const replyList = ref<Comment[]>([])
const totalReply = ref(0)
const isInView = ref(false) // 是否出现在可视区域
const hasFetchReply = ref(false) // 是否已加载回复

watch(isInView, (val) => {
  if(val){
    getComments()
  }
})

defineExpose({
  triggerIfView
})
const emit = defineEmits(['refresh'])

function triggerReply() {
  showReply.value = !showReply.value
}

function handleReplySuccess(){
  showReply.value = false
  hasFetchReply.value = false
  if(props.comment.replyCommentId){
    emit('refresh')
  }else{
    getComments()
  }
}

function handleRefresh() {
  hasFetchReply.value = false
  getComments()
}

// 由父组件调用
function triggerIfView(val: boolean) {
  isInView.value = val
}

async function getComments() {
  if(hasFetchReply.value) return

  try{
    const { result, success } = await useFetchPost('/comment/list', { blogId: props.comment.blogId, replyCommentId: props.comment.id })
    if(success){
      hasFetchReply.value = true
      replyList.value = result.list
      totalReply.value = result.total
    }
  }catch (e) {
    console.log('=====/comment/list=======', e)
  }
}

</script>

<style lang="scss" scoped>
.comment-container{
  display: flex;
  align-items: flex-start;
  padding-top: 20px;
  margin-bottom: 12px;
  &+&{
    border-top: 1px solid var(--border-color);
  }
  .comment-right-container{
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    .user-name{
      font-weight: 600;
      font-size: 20px;
    }
    .content{
      margin: 12px 0;
      .at-user{
        cursor: pointer;
        color: #00dc82;
        margin-right: 5px;
      }
    }
    .action-container{
      display: flex;
      align-items: center;
      .comment-time{
        margin-right: 12px;
      }
    }
    .reply-container{
      background-color: var(--content-block-background-color);
      border-radius: 5px;
      margin-top: 12px;
      :deep(.comment-container){
        padding: 12px 12px 0;
        //background-color: #F7F8FAB2;
      }
    }
  }
}
</style>
