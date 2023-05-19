<template>
  <div class="flex flex-col gap-[12px]">
    <n-input
      :placeholder="placeholder"
      type="textarea"
      size="small"
      @keyup.shift.enter="commitComment"
      v-model:value="commentContent"
      :autosize="{
        minRows: 3,
        maxRows: 5
      }"
    />
    <div class="flex justify-between items-center">
      <MediaUploadImg
        @complete="imageFile = $event"
        :model-value="imageFile?.url"
        size="42"
      >
        <template #preview>
          <MediaImgView
            class="w-[42px] h-[42px] object-cover"
            :url="imageFile?.url"
          />
        </template>
        <template #trigger>
          <n-icon
            class="text-green-600 cursor-pointer"
            :component="ImageAdd24Regular"
            size="36px"
          ></n-icon>
        </template>
      </MediaUploadImg>
      <n-button
        type="primary"
        @click="commitComment"
        :loading="commentCommitting"
        >{{ btnText }}</n-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NIcon, createDiscreteApi, NButton, NInput } from 'naive-ui'
import { ImageAdd24Regular } from '@vicons/fluent'
import { Comment, MediaFile } from 'sys-types'

interface Props {
  placeholder?: string
  btnText?: string
  blogId: string | number
  level: number // 发表第几级评论
  comment?: Comment
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入评论（Enter换行，Shift + Enter发送）',
  btnText: '发表评论'
})
const emit = defineEmits(['success'])

const commentContent = ref('')
const commentCommitting = ref(false)
const imageFile = ref<MediaFile>()

async function commitComment() {
  const { message } = createDiscreteApi(['message'])
  const content = commentContent.value.trim()

  if (!content && !imageFile.value) {
    message.warning('请输入内容')
    return
  }

  const postParams: any = {
    blogId: props.blogId,
    content,
    topCommentId: props.comment?.topCommentId || props.comment?.id,
    replyCommentId: props.level !== 1 ? props.comment?.id : null,
    replyToId: props.comment?.createBy?.id
  }

  if (imageFile.value) {
    postParams.imageId = imageFile.value.id
  }

  try {
    commentCommitting.value = true
    const { result, success, msg } = await useFetchPost(
      '/comment/commit',
      postParams
    )
    commentCommitting.value = false
    if (success) {
      emit('success', result)
      commentContent.value = ''
      imageFile.value = undefined
      message.success('发表成功')
    } else {
      message.error(msg as string)
    }
  } catch (e) {
    commentCommitting.value = false
    console.log('=====/comment/commit=======', e)
  }
}
</script>
