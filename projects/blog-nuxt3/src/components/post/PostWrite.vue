<template>
  <el-drawer
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :model-value="show"
    size="40%"
    title="快捷发布"
    @close="emit('update:show', $event)"
  >
    <div class="flex h-full w-full flex-col items-start gap-[12px]">
      <el-switch
        v-model="postForm.contentType"
        active-value="2"
        inactive-value="1"
        active-text="富文本"
        inactive-text="简单文本"
      />
      <LazyTextareaEditor
        v-if="postForm.contentType == BlogContentType.richTxt"
        v-model="postForm.content"
      />
      <TopicContentTextarea v-else v-model="postForm.content" />
      <MediaUploadMulti
        v-if="postForm.contentType == BlogContentType.normal"
        v-model="postForm.medias"
        class="flex-1"
        size="100px"
      />
    </div>

    <template #footer>
      <div class="w-full text-center">
        <el-button
          class="w-[200px]"
          type="primary"
          round
          :loading="isProcessing"
          @click="handlePost"
          >发布
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { BlogContentType, type Blog } from 'sys-types'

interface BlogForm
  extends Pick<Blog, 'id' | 'content' | 'contentType' | 'medias' | 'cateId'> {
  isPost?: number
}

interface Props {
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})
const emit = defineEmits(['complete', 'update:show'])
const fetchNewPost = useFetchNewPost()
const { $HttpUtils } = useNuxtApp()
const postForm = ref<BlogForm>({
  id: '',
  content: '',
  isPost: 1,
  contentType: BlogContentType.normal,
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
    const { result, success, msg } = await $HttpUtils.post<Blog>(
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
