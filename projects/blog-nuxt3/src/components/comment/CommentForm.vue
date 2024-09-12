<template>
  <div class="flex items-start gap-[12px] pb-[20px]" v-if="userInfo">
    <UserAvatar
      class="mr-[12px]"
      :user="userInfo"
      :size="42"
      disabled
    ></UserAvatar>
    <div class="flex flex-1 flex-col gap-[12px]">
      <el-input
        :placeholder="placeholder"
        type="textarea"
        size="small"
        @keyup.shift.enter="commitComment"
        v-model="commentContent"
        :autosize="{
          minRows: 3,
          maxRows: 5
        }"
      />
      <div class="flex items-center justify-between">
        <MediaUploadImg
          @complete="imageFile = $event"
          :model-value="imageFile?.url"
          :showPreviewIcon="false"
          :showBorder="false"
          width="42px"
          height="42px"
        >
          <template #trigger>
            <Icon
              name="fluent:image-add-24-regular"
              class="cursor-pointer text-primary"
              size="36"
            ></Icon>
          </template>
        </MediaUploadImg>
        <el-button
          type="primary"
          @click="commitComment"
          :loading="commentCommitting"
          >{{ btnText }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Comment, MediaFile } from 'sys-types'

interface Props {
  placeholder?: string
  btnText?: string
  blogId: string | number
  comment?: Comment
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入评论（Enter换行，Shift + Enter发送）',
  btnText: '发表评论'
})
const emit = defineEmits(['success'])

const {$HttpUtils} = useNuxtApp()
const commentContent = ref('')
const commentCommitting = ref(false)
const imageFile = ref<MediaFile>()
const userInfo = useUserInfo()

async function commitComment() {
  const content = commentContent.value.trim()

  if (!content && !imageFile.value) {
    ElMessage.warning('请输入内容')
    return
  }

  const postParams: object = {
    blogId: props.blogId,
    content
  }

  if (props.comment) {
    postParams.topCommentId = props.comment.topCommentId || props.comment.id
    postParams.replyCommentId = props.comment.id
    postParams.replyToId = props.comment.createById
  }

  if (imageFile.value) {
    postParams.imageId = imageFile.value.id
  }

  try {
    commentCommitting.value = true
    const { result, success, msg } = await $HttpUtils.post(
      '/comment/commit',
      postParams
    )
    commentCommitting.value = false
    if (success) {
      emit('success', result)
      commentContent.value = ''
      imageFile.value = undefined
      ElMessage.success('发表成功')
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {
    commentCommitting.value = false
    console.log('=====/comment/commit=======', e)
  }
}
</script>
