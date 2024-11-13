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
      v-if="currentComment.image"
      :url="currentComment.image.url"
      enable-preview
      class="max-h-[135px] max-w-[180px] object-contain"
    />

    <div class="group flex w-full items-center justify-between">
      <div class="flex flex-1 items-center">
        <span
          v-time="new Date(currentComment.createdAt)"
          class="mr-[12px] text-gray-500"
        />
        <el-button v-if="userInfo" text @click="triggerReply">
          <template #icon>
            <Icon
              :name="
                showReply ? 'fluent:chat-24-filled' : 'fluent:chat-24-regular'
              "
              size="18"
            />
          </template>
          {{ showReply ? '取消回复' : '回复' }}
        </el-button>
      </div>
      <div class="flex items-center gap-[12px]">
        <span
          class="hidden cursor-pointer leading-[1] text-red-600 group-hover:inline-block"
        >
          <Icon
            v-if="currentComment?.createById === userInfo?.id"
            name="fluent:delete-24-regular"
            size="18"
            :loading="commentDeleting"
            @click="handleDeleteComment"
          />
        </span>
        <div
          class="flex cursor-pointer items-center justify-center gap-[6px]"
          @click="handleLikeComment"
        >
          <Icon
            v-if="currentComment.isLike"
            name="fluent:thumb-like-20-filled"
            class="text-primary"
            size="18"
          />
          <Icon v-else name="fluent:thumb-like-20-regular" size="18" />
          <span>{{ currentComment.likedByCount || '' }}</span>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <CommentForm
        v-if="showReply"
        class="w-full"
        btn-text="发布"
        :placeholder="`回复 ${currentComment.createBy.name}:`"
        :level="2"
        :comment="currentComment"
        :blog-id="currentComment.blogId"
        @success="handleReplySuccess"
      />
    </Transition>

    <div
      v-if="currentComment.childComments!.length > 0 && showChildren"
      class="bg-content-light dark:bg-content-dark min-w-full rounded-[5px] px-[12px]"
    >
      <CommentItem
        v-for="(reply, index) of currentComment.childComments"
        :key="reply.id"
        class="py-[12px]"
        :comment="reply"
        @reply-success="
          (rep) => currentComment.childComments?.splice(index, 0, rep)
        "
        @comment-delete="getCommentInfo()"
      />
      <el-button
        v-if="currentComment.childCommentsCount! > 2"
        class="mb-[12px]"
        text
        type="primary"
        icon-placement="right"
        @click="showReplyDetailList = true"
      >
        共 {{ currentComment.childCommentsCount }} 条回复
        <template #icon>
          <Icon name="fluent:chevron-down-24-filled" />
        </template>
      </el-button>
    </div>
  </div>

  <client-only>
    <el-drawer v-model="showReplyDetailList" width="500px">
      <template #header>
        <h3>所有回复</h3>
      </template>
      <CommentReplyList
        :comment="currentComment"
        @comment-delete="handleDeleteTopComment"
      />
    </el-drawer>
  </client-only>
</template>

<script setup lang="ts">
import type { Comment } from 'sys-types'

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
const { $HttpUtils } = useNuxtApp()
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
    currentComment.value.childComments.unshift(reply)
  }
  emits('replySuccess', reply)
}

async function handleDeleteComment() {
  ElMessageBox.confirm('确定删除该评论？该评论下的所有回复也将被删除', '删除', {
    type: 'error',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
    .then(async () => {
      try {
        commentDeleting.value = true
        const { result, success, msg } = await $HttpUtils.post(
          '/comment/delete',
          {
            id: currentComment.value.id
          }
        )
        commentDeleting.value = false
        if (success) {
          ElMessage.success('删除成功')
          emits('commentDelete', currentComment.value)
        } else {
          ElMessage.error(msg as string)
        }
      } catch (e) {
        commentDeleting.value = false
        console.log('=====/comment/delete=======', e)
      }
    })
    .catch()
}

function handleDeleteTopComment(comment: Comment) {
  showReplyDetailList.value = false
  emits('commentDelete', comment)
}

async function getCommentInfo() {
  try {
    commentDeleting.value = true
    const { result, success, msg } = await $HttpUtils.post<Comment>(
      '/comment/info',
      {
        id: currentComment.value.id
      }
    )
    if (success) {
      currentComment.value = result as Comment
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {
    console.log('=====/comment/info=======', e)
  }
}

async function handleLikeComment() {
  if (!userInfo.value || likeLoading.value) {
    return ElMessage.info('请先登录')
  }

  try {
    likeLoading.value = true
    const { result, success } = await $HttpUtils.post('/comment/like', {
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
