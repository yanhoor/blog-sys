<template>
  <div v-bind="attrs" class="w-full flex flex-col gap-[8px] items-start">
    <div class="flex items-center gap-[6px]">
      <UserAvatar :user="comment.createBy" :size="42" />
      <UserName :user="comment.createBy" />
    </div>

    <div>
      <div v-if="comment.replyComment?.topCommentId" class="inline mr-[2px]">
        回复
        <UserName :user="comment.replyComment.createBy" show-at />:
      </div>
      <ExpandableContent
        class="inline"
        :content="
          comment.content || (comment.replyComment ? '图片回复' : '图片评论')
        "
        :max-length="160"
      />
    </div>

    <MediaImgView
      :url="comment.image.url"
      v-if="comment.image"
      enablePreview
      class="max-w-[180px] max-h-[135px] object-contain"
    />

    <div class="flex items-center justify-between w-full group">
      <div class="flex items-center flex-1">
        <span
          class="mr-[12px] text-gray-500"
          v-time="new Date(comment.createdAt)"
        ></span>
        <n-button text @click="triggerReply" v-if="userInfo">
          <template #icon>
            <n-icon :component="showReply ? Chat24Filled : Chat24Regular" />
          </template>
          {{ showReply ? '取消回复' : '回复' }}
        </n-button>
      </div>
      <div class="flex items-center gap-[12px]">
        <n-icon
          class="text-red-600 cursor-pointer hidden group-hover:inline-block"
          :component="Delete24Regular"
          size="18"
          @click="handleDeleteComment"
          :loading="commentDeleting"
          v-if="comment?.createById === userInfo?.id"
        />
        <div
          class="flex justify-center items-center cursor-pointer gap-[6px]"
          @click="handleLikeComment"
        >
          <n-icon
            class="text-green-700"
            size="18"
            :component="ThumbLike16Filled"
            v-if="comment.isLike"
          ></n-icon>
          <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
          <span>{{ comment.likedByCount || '' }}</span>
        </div>
      </div>
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

    <div
      v-if="comment.childComments?.length > 0"
      class="px-[12px] bg-content-light dark:bg-content-dark rounded-[5px] min-w-full"
    >
      <CommentItem
        v-for="(reply, index) of comment.childComments"
        class="py-[12px]"
        :comment="reply"
        :key="reply.id"
        @replySuccess="(rep) => comment.childComments.splice(index, 0, rep)"
        @commentDelete="(_) => comment.childComments.splice(index, 1)"
      />
      <n-button
        class="mb-[12px]"
        text
        type="primary"
        icon-placement="right"
        v-if="comment.childCommentsCount > 2"
        @click="showReplyDetailList = true"
      >
        共 {{ comment.childCommentsCount }} 条回复
        <template #icon>
          <n-icon :component="ChevronDown24Filled" />
        </template>
      </n-button>
    </div>
  </div>

  <n-drawer v-model:show="showReplyDetailList" width="500px">
    <n-drawer-content title="所有回复" body-content-style="padding: 0">
      <CommentReplyList
        :comment="comment"
        @commentDelete="handleDeleteTopComment"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { Comment } from 'sys-types'
import {
  NButton,
  NCollapseTransition,
  NIcon,
  createDiscreteApi,
  NDrawer,
  NDrawerContent,
  DialogOptions
} from 'naive-ui'
import {
  Chat24Regular,
  Chat24Filled,
  ChevronDown24Filled,
  ThumbLike16Filled,
  ThumbLike16Regular,
  Delete24Regular
} from '@vicons/fluent'

// 如果 props.comment.topCommentId 存在，props.comment 就是评论的回复，即当前组件在第二层
interface Props {
  comment: Comment
}

const attrs = useAttrs()
const props = defineProps<Props>()
const emits = defineEmits(['replySuccess', 'commentDelete'])
const userInfo = useUserInfo()
const showReply = ref(false)
const commentDeleting = ref(false)
const showReplyDetailList = ref(false)

function triggerReply() {
  showReply.value = !showReply.value
}

function handleReplySuccess(reply: Comment) {
  showReply.value = false
  if (props.comment.childComments) {
    props.comment.childComments.splice(0, 0, reply)
  } else {
    emits('replySuccess', reply)
  }
}

async function handleDeleteComment() {
  const { message, dialog } = createDiscreteApi(['message', 'dialog'])
  dialog.error({
    title: '删除',
    content: '确定删除该评论？该评论下的所有回复也将被删除',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        commentDeleting.value = true
        const { result, success, msg } = await useFetchPost('/comment/delete', {
          id: props.comment.id
        })
        commentDeleting.value = false
        if (success) {
          message.success('删除成功')
          emits('commentDelete', props.comment)
        } else {
          message.error(msg as string)
        }
      } catch (e) {
        commentDeleting.value = false
        console.log('=====/comment/delete=======', e)
      }
    },
    onNegativeClick: async () => {}
  } as DialogOptions)
}

function handleDeleteTopComment(comment: Comment) {
  showReplyDetailList.value = false
  emits('commentDelete', comment)
}

async function handleLikeComment() {
  const { message } = createDiscreteApi(['message'])
  if (!userInfo.value) {
    return message.info('请先登录')
  }

  try {
    const { result, success } = await useFetchPost('/comment/like', {
      id: props.comment.id,
      isLike: props.comment.isLike ? 0 : 1
    })
    if (success) {
      props.comment.isLike = !props.comment.isLike
      props.comment.isLike
        ? props.comment.likedByCount++
        : props.comment.likedByCount--
    }
  } catch (e) {}
}
</script>
