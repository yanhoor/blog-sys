<template>
  <n-drawer
    :mask-closable="false"
    :close-on-esc="false"
    :show="show"
    @update:show="emit('update:show', $event)"
    width="500px"
  >
    <n-drawer-content title="快捷发布" closable>
      <div class="flex h-full w-full flex-col items-start gap-[12px]">
        <div class="relative w-full">
          <n-input
            id="nInput"
            ref="inputRef"
            v-model:value="postForm.content"
            @input="handleSearchTopic"
            @blur="showTopicList = false"
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
        </div>
        <div class="flex items-start gap-[12px]">
          <n-popover
            placement="bottom"
            :show="showTopicList"
            trigger="click"
            style="--n-padding: 0px"
          >
            <template #trigger>
              <n-button
                round
                tertiary
                type="primary"
                size="medium"
                @click="handleAddTopic"
              >
                <template #icon>#</template>
                话题
              </n-button>
            </template>
            <template #header>
              <p class="px-[12px] py-[5px]">想用什么话题</p>
            </template>
            <div class="max-h-[400px] overflow-auto">
              <p
                v-for="topic of topicList"
                :key="topic.id"
                class="px-[12px] py-[5px] hover:bg-green-700 hover:text-white"
                @click="handleSelectTopic(topic.content)"
              >
                {{ topic.content }}
              </p>
            </div>
          </n-popover>
          <MediaUploadMulti v-model="postForm.medias" size="100px" />
        </div>
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
import { Blog, Topic } from 'sys-types'
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
const showTopicList = ref(false)
const topicList = ref<Topic[]>([])
const inputRef = ref<HTMLInputElement>(null)

watch(
  () => props.show,
  (val) => {
    if (val) {
      nextTick(() => {
        const textarea: HTMLTextAreaElement =
          document.querySelector('#nInput textarea')
        textarea.addEventListener('click', handleSearchTopic)
      })
    } else {
      const textarea: HTMLTextAreaElement =
        document.querySelector('#nInput textarea')
      textarea?.removeEventListener('click', handleSearchTopic)
    }
  }
)

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

function handleSearchTopic() {
  const textarea: HTMLTextAreaElement =
    document.querySelector('#nInput textarea')
  // console.log(
  //   '=====选中位置=========',
  //   textarea.selectionStart,
  //   textarea.selectionEnd
  // )
  const v = postForm.value.content
  const idx = v.lastIndexOf('#', textarea.selectionEnd)
  const range = v.slice(idx, textarea.selectionEnd) // 获取 # 与 光标之间的文本
  // 以#结尾或以#+非空格+任意字符结尾(即排除 #+空格+字符)
  if (/#$|#\S*$/g.test(range)) {
    showTopicList.value = true
    searchTopicList(range.slice(1))
  } else {
    showTopicList.value = false
  }
}

function handleSelectTopic(topic: string) {
  const textarea: HTMLTextAreaElement =
    document.querySelector('#nInput textarea')
  const idx = postForm.value.content.lastIndexOf('#', textarea.selectionEnd)
  const temp = postForm.value.content
  postForm.value.content = [
    temp.slice(0, idx + 1),
    `${topic}# `,
    temp.slice(textarea.selectionEnd)
  ].join('')
  showTopicList.value = false
  nextTick(() => {
    inputRef.value.focus()
  })
}

function handleAddTopic() {
  const textarea: HTMLTextAreaElement =
    document.querySelector('#nInput textarea')
  const idx = textarea.selectionEnd
  const temp = postForm.value.content
  // 在光标处插入 #
  postForm.value.content = [temp.slice(0, idx), '#', temp.slice(idx)].join('')
  // 插入完成后将光标移到 # 后
  textarea.focus()
  nextTick(() => textarea.setSelectionRange(idx + 1, idx + 1))
  showTopicList.value = true
  searchTopicList()
}

async function searchTopicList(keyword?: string) {
  try {
    const { result, success, msg } = await useFetchPost('/topic/list', {
      keyword
    })
    if (success) {
      topicList.value = result.list
    }
  } catch (e) {}
}
</script>
