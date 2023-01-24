<template>
  <n-modal
    :show="show"
  >
    <n-card
      :title="`${ comment._count?.childComments } 条回复`"
      size="huge"
      closable
      @close="handleShowUpdate"
      class="w-1/2 max-h-screen flex flex-col"
      content-style="flex: 1; overflow: auto"
    >
      <CommentItem :comment="comment" :allowLoadMoreReply="true"/>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import {
  NModal,
  NButton,
  NCard
} from "naive-ui"

interface Props{
  comment: Comment
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])

function handleShowUpdate() {
  emit('update:show', false)
}
</script>
