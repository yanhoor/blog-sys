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
        <n-switch
          checked-value="2"
          unchecked-value="1"
          v-model:value="postForm.contentType"
        >
          <template #checked> 富文本 </template>
          <template #unchecked> 简单文本 </template>
        </n-switch>
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
          <n-button
            class="w-[200px]"
            type="primary"
            round
            @click="handlePost"
            :loading="isProcessing"
            >发布
          </n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { NButton, NDrawer, NDrawerContent, NSwitch } from 'naive-ui'
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
