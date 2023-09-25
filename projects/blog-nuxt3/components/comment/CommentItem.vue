<template>
  <div v-bind="attrs" class="flex w-full flex-col items-start gap-[8px]">
    <div class="flex items-center gap-[6px]">
      <UserAvatar :user="currentComment.createBy" :size="42" />
      <UserName :user="currentComment.createBy" />
    </div>

    <div>
      <div
        v-if="currentComment.replyComment?.topCommentId"
        class="mr-[2px] inline"
      >
        回复
        <UserName :user="currentComment.replyComment.createBy" show-at />:
      </div>
      <ExpandableContent
        class="inline"
        :content="
          currentComment.content ||
          (currentComment.replyComment ? '图片回复' : '图片评论')
        "
        :max-length="160"
      />
    </div>

    <MediaImgView
      :url="currentComment.image.url"
      v-if="currentComment.image"
      enablePreview
      class="max-h-[135px] max-w-[180px] object-contain"
    />

    <div class="group flex w-full items-center justify-between">
      <div class="flex flex-1 items-center">
        <span
          class="mr-[12px] text-gray-500"
          v-time="new Date(currentComment.createdAt)"
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
          class="hidden cursor-pointer text-red-600 group-hover:inline-block"
          :component="Delete24Regular"
          size="18"
          @click="handleDeleteComment"
          :loading="commentDeleting"
          v-if="currentComment?.createById === userInfo?.id"
        />
        <div
          class="flex cursor-pointer items-center justify-center gap-[6px]"
          @click="handleLikeComment"
        >
          <n-icon
            class="text-primary"
            size="18"
            :component="ThumbLike16Filled"
            v-if="currentComment.isLike"
          ></n-icon>
          <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
          <span>{{ currentComment.likedByCount || '' }}</span>
        </div>
      </div>
    </div>

    <n-collapse-transition :show="showReply">
      <CommentForm
        btnText="发布"
        :placeholder="`回复 ${currentComment.createBy.name}:`"
        :level="2"
        :comment="currentComment"
        :blogId="currentComment.blogId"
        @success="handleReplySuccess"
      />
    </n-collapse-transition>

    <div
      v-if="currentComment.childComments?.length > 0 && showChildren"
      class="min-w-full rounded-[5px] bg-content-light px-[12px] dark:bg-content-dark"
    >
      <CommentItem
        v-for="(reply, index) of currentComment.childComments"
        class="py-[12px]"
        :comment="reply"
        :key="reply.id"
        @replySuccess="
          (rep) => currentComment.childComments.splice(index, 0, rep)
        "
        @commentDelete="getCommentInfo()"
      />
      <n-button
        class="mb-[12px]"
        text
        type="primary"
        icon-placement="right"
        v-if="currentComment.childCommentsCount > 2"
        @click="showReplyDetailList = true"
      >
        共 {{ currentComment.childCommentsCount }} 条回复
        <template #icon>
          <n-icon :component="ChevronDown24Filled" />
        </template>
      </n-button>
    </div>
  </div>

  <n-drawer v-model:show="showReplyDetailList" width="500px">
    <n-drawer-content title="所有回复" body-content-style="padding: 0">
      <CommentReplyList
        :comment="currentComment"
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

// 如果 currentComment.value.topCommentId 存在，currentComment.value 就是评论的回复，即当前组件在第二层
interface Props {
  comment: Comment
  showChildren?: boolean
}

const attrs = useAttrs()
const props = withDefaults(defineProps<Props>(), {
  showChildren: true
})
const emits = defineEmits(['replySuccess', 'commentDelete'])
const userInfo = useUserInfo()
const showReply = ref(false)
const likeLoading = ref(false)
const commentDeleting = ref(false)
const showReplyDetailList = ref(false)
const currentComment = ref<Comment>(props.comment)

function triggerReply() {
  showReply.value = !showReply.value
}

function handleReplySuccess(reply: Comment) {
  showReply.value = false
  if (currentComment.value.childComments) {
    currentComment.value.childComments.splice(0, 0, reply)
  } else {
    emits('replySuccess', reply)
  }
}

async function handleDeleteComment() {
  const { message, dialog } = useDiscreteApi(['message', 'dialog'])
  dialog.error({
    title: '删除',
    content: '确定删除该评论？该评论下的所有回复也将被删除',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        commentDeleting.value = true
        const { result, success, msg } = await useFetchPost('/comment/delete', {
          id: currentComment.value.id
        })
        commentDeleting.value = false
        if (success) {
          message.success('删除成功')
          emits('commentDelete', currentComment.value)
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

async function getCommentInfo() {
  const { message } = useDiscreteApi(['message'])
  try {
    commentDeleting.value = true
    const { result, success, msg } = await useFetchPost('/comment/info', {
      id: currentComment.value.id
    })
    if (success) {
      currentComment.value = result
    } else {
      message.error(msg as string)
    }
  } catch (e) {
    console.log('=====/comment/info=======', e)
  }
}

async function handleLikeComment() {
  const { message } = useDiscreteApi(['message'])
  if (!userInfo.value || likeLoading.value) {
    return message.info('请先登录')
  }

  try {
    likeLoading.value = true
    const { result, success } = await useFetchPost('/comment/like', {
      id: currentComment.value.id,
      isLike: currentComment.value.isLike ? 0 : 1
    })
    likeLoading.value = false
    if (success) {
      currentComment.value.isLike = !currentComment.value.isLike
      currentComment.value.isLike
        ? currentComment.value.likedByCount++
        : currentComment.value.likedByCount--
    }
  } catch (e) {
    likeLoading.value = false
  }
}
</script>
