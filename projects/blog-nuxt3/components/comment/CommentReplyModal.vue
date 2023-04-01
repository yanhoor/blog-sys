<template>
  <n-modal :show="show">
    <n-card
      :title="`${comment.childCommentsCount} 条回复`"
      size="huge"
      closable
      @close="handleShowUpdate"
      class="w-2/3 max-h-screen flex flex-col"
      content-style="flex: 1; overflow: hidden; display: flex; flex-direction: column"
    >
      <div id="replyModalContent" class="overflow-auto">
        <CommentItem :comment="comment" />
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import { NModal, NButton, NCard } from 'naive-ui'

interface Props {
  comment: Comment
  show: boolean
}

provide('allow_load_more_reply', true)
const props = defineProps<Props>()
const emit = defineEmits(['update:show'])

function handleShowUpdate() {
  emit('update:show', false)
}
</script>
