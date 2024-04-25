<template>
  <n-drawer
    :mask-closable="false"
    :close-on-esc="false"
    :show="show"
    @update:show="emit('update:show', $event)"
    width="520px"
  >
    <n-drawer-content title="快捷发布" closable>
      <div class="flex h-full w-full flex-col items-start gap-[12px]">
        <TopicContentTextarea v-model="postForm.content" />
        <MediaUploadMulti
          class="flex-1"
          v-model="postForm.medias"
          size="100px"
        />
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
import { NButton, NInput, NDrawer, NDrawerContent, NPopover } from 'naive-ui'
import type { Blog, Topic } from 'sys-types'
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
const contentRef = ref()

async function handlePost() {
  const { message } = useDiscreteApi(['message'])
  postForm.value.content = postForm.value.content.trim()
  if (!postForm.value.content) {
    message.error('请输入内容')
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
