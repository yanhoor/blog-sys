<template>
  <div
    id="replyModalContent"
    v-loadMore="{
      handler: handleLoadNextPage,
      scrollElSelector: '#replyModalContent'
    }"
    class="bg-page-light dark:bg-page-dark h-full overflow-y-auto"
  >
    <div class="flex flex-col gap-[12px]">
      <el-card v-if="topComment" :bordered="false">
        <CommentItem
          :show-children="false"
          :comment="topComment"
          @reply-success="handleInit"
          @comment-delete="emits('commentDelete', topComment)"
        />
      </el-card>

      <div class="mx-[12px] flex gap-[12px] text-[16px]">
        <span
          class="cursor-pointer"
          :class="{ 'text-primary': sortType === 1 }"
          @click="handleChangeSortType(1)"
          >按时间</span
        >
        <span
          class="cursor-pointer"
          :class="{ 'text-primary': sortType === 2 }"
          @click="handleChangeSortType(2)"
          >按热度</span
        >
      </div>

      <el-card :bordered="false">
        <div
          v-auto-animate
          class="divide-border-light dark:divide-border-dark flex flex-col divide-y"
        >
          <CommentItem
            v-for="reply of pageList"
            :key="reply.id"
            class="py-[12px]"
            :comment="reply"
            @reply-success="handleInit"
            @comment-delete="handleLoadNextPage(1)"
          />
        </div>

        <ResultLoading v-if="pageLoading" />
        <ResultError
          v-else-if="!fetchResult"
          @refresh="handleLoadNextPage(1)"
        />
        <ResultEmpty
          v-else-if="pageList.length === 0"
          @refresh="handleLoadNextPage(1)"
        />
        <ResultNoMore v-else-if="pageLoadedFinish" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from 'sys-types'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()
const emits = defineEmits(['commentDelete'])
const { $HttpUtils } = useNuxtApp()
const sortType = ref(2) // 1--按时间，2--按热度
const topComment = ref<Comment>()
const {
  pageList,
  fetchResult,
  pageLoading,
  pageLoadedFinish,
  handleLoadNextPage,
  handleChangeFetchParams
} = useListAppendFetch<Comment>(
  '/comment/replyList',
  { topCommentId: props.comment.id },
  {
    pageSize: 10,
    uniqueKey: 'id'
  }
)

handleInit()

function handleInit() {
  getTopCommentDetail()
  handleLoadNextPage(1)
}

async function getTopCommentDetail() {
  try {
    const { result, success, msg } = await $HttpUtils.post('/comment/info', {
      id: props.comment.id
    })
    if (success) {
      topComment.value = result
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {
    console.log('=====/comment/delete=======', e)
  }
}

function handleChangeSortType(type: number) {
  if (sortType.value === type) return

  sortType.value = type
  handleChangeFetchParams({ sort: sortType.value })
}
</script>
