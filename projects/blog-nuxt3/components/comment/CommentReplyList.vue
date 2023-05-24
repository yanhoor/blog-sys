<template>
  <div
    id="replyModalContent"
    class="h-full overflow-y-auto bg-page-light dark:bg-page-dark"
    v-loadMore="{
      handler: handleLoadNextPage,
      scrollElSelector: '#replyModalContent'
    }"
  >
    <div class="flex flex-col gap-[12px]">
      <n-card :bordered="false" v-if="topComment">
        <CommentItem
          :comment="topComment"
          @replySuccess="handleInit"
          @commentDelete="emits('commentDelete', topComment)"
        />
      </n-card>

      <div class="flex gap-[12px] text-[16px] mx-[12px]">
        <span
          class="cursor-pointer"
          :class="{ 'text-green-700': sortType === 1 }"
          @click="handleChangeSortType(1)"
          >按时间</span
        >
        <span
          class="cursor-pointer"
          :class="{ 'text-green-700': sortType === 2 }"
          @click="handleChangeSortType(2)"
          >按热度</span
        >
      </div>

      <n-card :bordered="false">
        <div
          class="flex flex-col divide-y divide-border-light dark:divide-border-dark"
        >
          <CommentItem
            class="py-[12px]"
            :comment="reply"
            v-for="reply of pageList"
            :key="reply.id"
            @replySuccess="handleInit"
            @commentDelete="handleLoadNextPage(1)"
          />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Comment } from 'sys-types'
import { NCard, createDiscreteApi } from 'naive-ui'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()
const emits = defineEmits(['commentDelete'])
const sortType = ref(1) // 1--按时间，2--按热度
const topComment = ref<Comment>()
const {
  pageList,
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
  const { message } = createDiscreteApi(['message', 'dialog'])

  try {
    const { result, success, msg } = await useFetchPost('/comment/info', {
      id: props.comment.id
    })
    if (success) {
      topComment.value = result
    } else {
      message.error(msg as string)
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
