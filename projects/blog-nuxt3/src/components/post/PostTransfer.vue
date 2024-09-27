<template>
  <div class="flex items-start gap-[12px] pb-[20px]" v-if="userInfo">
    <UserAvatar
      class="mr-[12px]"
      :user="userInfo"
      :size="42"
      disabled
    ></UserAvatar>
    <div class="flex flex-1 flex-col gap-[12px]">
      <TopicContentTextarea
        ref="contentRef"
        v-model="textContent"
        :showCount="false"
        placeholder="说说分享心得"
        :autosize="{
          minRows: 1,
          maxRows: 3
        }"
      ></TopicContentTextarea>
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
              size="36"
              class="cursor-pointer text-primary"
            ></Icon>
          </template>
        </MediaUploadImg>
        <el-button
          type="primary"
          @click="commitTransfer"
          :loading="isCommitting"
          >{{ btnText }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Comment, MediaFile, Blog } from 'sys-types'

interface Props {
  placeholder?: string
  btnText?: string
  blog: Blog
  comment?: Comment
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入内容（Enter换行，Shift + Enter发送）',
  btnText: '转发'
})
const emit = defineEmits(['success'])

const {$HttpUtils} = useNuxtApp()
const textContent = ref(
  props.blog.retweetOriginBlogId
    ? `//@${props.blog.createBy.name}:${props.blog.content}`
    : ``
)
const isCommitting = ref(false)
const imageFile = ref<MediaFile>()
const userInfo = useUserInfo()

async function commitTransfer() {
  const content = textContent.value.trim()

  if (!content && !imageFile.value) {
    ElMessage.warning('请输入内容')
    return
  }

  const postParams: object = {
    referenceId: props.blog.id,
    content
  }

  if (imageFile.value) {
    postParams.medias = [
      {
        fileId: imageFile.value.id
      }
    ]
  }

  try {
    isCommitting.value = true
    const { result, success, msg } = await $HttpUtils.post(
      '/blog/edit',
      postParams
    )
    isCommitting.value = false
    if (success) {
      emit('success', result)
      textContent.value = ''
      imageFile.value = undefined
      ElMessage.success('发表成功')
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {
    isCommitting.value = false
    console.log('=====/blog/edit=======', e)
  }
}
</script>
