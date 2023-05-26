<template>
  <n-drawer
    :mask-closable="false"
    :close-on-esc="false"
    :show="show"
    @update:show="emit('update:show', $event)"
    width="30%"
  >
    <n-drawer-content title="快捷发布" closable>
      <div class="w-full h-full flex flex-col items-start gap-[12px]">
        <n-input
          v-model:value="postForm.content"
          type="textarea"
          placeholder="请输入"
          size="large"
          show-count
          clearable
          :autosize="{
            minRows: 5,
            maxRows: 15
          }"
        />
        <MediaUploadMulti v-model="postForm.medias" size="100px" />
      </div>

      <template #footer>
        <div class="w-full text-center">
          <n-button
            class="w-[200px]"
            type="primary"
            round
            @click="handlePost"
            :loading="isProcessing"
            >发布</n-button
          >
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NButton,
  NInput,
  NDrawer,
  NDrawerContent,
  createDiscreteApi
} from 'naive-ui'
import { Blog } from 'sys-types'
import MediaUploadMulti from '~/components/Media/MediaUploadMulti.vue'

interface BlogForm extends Blog {
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
const config = useRuntimeConfig()
const postForm = ref<BlogForm>({
  id: '',
  content: '',
  isPost: 1,
  medias: [],
  cateId: undefined // 空字符不会显示 placeholder
})
const isProcessing = ref(false)

async function handlePost() {
  const { message } = createDiscreteApi(['message'])
  postForm.value.content = postForm.value.content.trim()
  if (!postForm.value.content) {
    message.error('请输入内容')
    return
  }
  try {
    isProcessing.value = true
    const { result, success, msg } = await useFetchPost(
      '/blog/edit',
      postForm.value
    )
    isProcessing.value = false
    if (success) {
      message.success('发布成功')
      fetchNewPost.value = result
      emit('complete', result)
      emit('update:show', false)
    } else {
      message.error(msg as string)
    }
  } catch (e) {
    isProcessing.value = false
  }
}
</script>
