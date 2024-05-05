<template>
  <el-drawer
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :model-value="show"
    @close="emit('update:show', $event)"
    width="520px"
    title="快捷发布"
  >
    <div class="flex h-full w-full flex-col items-start gap-[12px]">
      <el-switch
        active-value="2"
        inactive-value="1"
        v-model="postForm.contentType"
        active-text="富文本"
        inactive-text="简单文本"
      >
      </el-switch>
      <TextareaEditor
        v-if="postForm.contentType == 2"
        v-model="postForm.content"
      ></TextareaEditor>
      <TopicContentTextarea v-else v-model="postForm.content" />
      <MediaUploadMulti
        v-if="postForm.contentType == 1"
        class="flex-1"
        v-model="postForm.medias"
        size="100px"
      />
    </div>

    <template #footer>
      <div class="w-full text-center">
        <el-button
          class="w-[200px]"
          type="primary"
          round
          @click="handlePost"
          :loading="isProcessing"
          >发布
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { Blog } from 'sys-types'
import MediaUploadMulti from '~/components/Media/MediaUploadMulti.vue'

interface BlogForm extends Blog {
  isPost?: number
  contentType?: number
}

interface Props {
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})
const emit = defineEmits(['complete', 'update:show'])
const fetchNewPost = useFetchNewPost()
const postForm = ref<BlogForm>({
  id: '',
  content: '',
  isPost: 1,
  contentType: 1,
  medias: [],
  cateId: undefined // 空字符不会显示 placeholder
})
const isProcessing = ref(false)

async function handlePost() {
  postForm.value.content = postForm.value.content.trim()
  if (!postForm.value.content) {
    ElMessage.error('请输入内容')
    return
  }
  postForm.value.content.trim()
  try {
    isProcessing.value = true
    const { result, success, msg } = await useFetchPost(
      '/blog/edit',
      postForm.value
    )
    isProcessing.value = false
    if (success) {
      ElMessage.success('发布成功')
      fetchNewPost.value = result
      emit('complete', result)
      emit('update:show', false)
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {
    isProcessing.value = false
  }
}
</script>
