<template>
  <div class="relative w-full">
    <el-input
      id="textAreaInput"
      :modelValue="modelValue"
      @input="handleInput"
      @blur="handleInputBlur"
      type="textarea"
      :placeholder="placeholder"
      size="large"
      :show-count="showCount"
      clearable
      :autosize="autosize"
    />
    <div
      class="card-bg-color absolute left-0 top-0 z-10 w-[70%]"
      :style="topicListElStyle"
    >
      <template v-if="showTopicList">
        <div
          class="max-h-[400px] overflow-auto rounded border border-primary"
          v-auto-animate
        >
          <p class="px-[12px] py-[5px] text-primary">想用什么话题</p>
          <p
            v-for="topic of topicList"
            :key="topic.id"
            class="cursor-pointer px-[12px] py-[5px] hover:bg-primary hover:text-white"
            @click.capture="handleSelectTopic(topic.content)"
          >
            {{ topic.content }}
          </p>
        </div></template
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Topic } from 'sys-types'

interface Props {
  placeholder?: string
  showCount?: boolean
  autosize?: {
    minRows: number
    maxRows: number
  }
}
const modelValue = defineModel({
  default: ''
})
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容（输入 # 插入话题）',
  showCount: true,
  autosize: () => ({
    minRows: 5,
    maxRows: 15
  })
})
const inputEl = ref<HTMLTextAreaElement>()
const {$HttpUtils} = useNuxtApp()
const showTopicList = ref(false)
const topicList = ref<Topic[]>([])
const topicPosition = reactive({
  x: 0,
  y: 0
})
const topicListElStyle = computed(() => {
  if (!inputEl.value) return

  const textareaPot = inputEl.value.getBoundingClientRect().left
  const topicListWidth = inputEl.value.offsetWidth * 0.7
  const maxWidth = document.documentElement.clientWidth
  // 是否超出右边界，30 余量
  const isOverRight =
    textareaPot + topicPosition.x + topicListWidth > maxWidth - 30
  return {
    left: isOverRight
      ? inputEl.value.offsetWidth * 0.3 + 'px'
      : topicPosition.x + 'px',
    top: topicPosition.y + 'px'
  }
})

defineExpose({ handleAddTopic })

onMounted(() => {
  nextTick(() => {
    inputEl.value = document.querySelector('#textAreaInput')
    if (!inputEl.value) return

    // console.log('========topic mounted========', inputEl.value)
    inputEl.value?.addEventListener('click', handleFocus)
    if (modelValue.value) {
      // 对于转发微博，已经有部分内容，将光标移到前面
      inputEl.value.focus({ preventScroll: true })
      inputEl.value.setSelectionRange(0, 0)
    }
  })
})
onUnmounted(() => {
  inputEl.value?.removeEventListener('click', handleFocus)
})

function handleFocus() {
  handleInput()
}

function handleInput(val: string = modelValue.value) {
  modelValue.value = val
  const textarea = inputEl.value
  const idx = val.lastIndexOf('#', textarea.selectionEnd - 1)
  const range = val.slice(idx, textarea.selectionEnd) // 获取 # 与 光标之间的文本
  // 以#结尾或以#+非空格+任意字符结尾(即排除 #+空格+字符)
  if (/^#[^@\[\]\s]*$/g.test(range)) {
    showTopicList.value = true
    searchTopicList(range.slice(1))
    handleGetPointerPosition(
      modelValue.value.slice(0, textarea.selectionEnd),
      modelValue.value.slice(textarea.selectionEnd)
    )
  } else {
    showTopicList.value = false
  }
}

function handleInputBlur() {
  setTimeout(() => {
    showTopicList.value = false
  })
}

function handleSelectTopic(topic: string) {
  console.log('======handleSelectTopic=========', topic)
  const textarea = inputEl.value
  const idx = modelValue.value.lastIndexOf('#', textarea.selectionEnd)
  const val = [
    modelValue.value.slice(0, idx + 1),
    `${topic}# `,
    modelValue.value.slice(textarea.selectionEnd)
  ].join('')
  showTopicList.value = false
  inputEl.value.focus()
  nextTick(() => {
    const index = idx + 3 + topic.length
    textarea.setSelectionRange(index, index)
  })
  modelValue.value = val
}

function handleAddTopic() {
  const textarea = inputEl.value
  const idx = textarea.selectionEnd
  // 在光标处插入 #
  const val = [
    modelValue.value.slice(0, idx),
    '#',
    modelValue.value.slice(idx)
  ].join('')
  modelValue.value = val
  // 插入完成后将光标移到 # 后
  textarea.focus()
  nextTick(() => textarea.setSelectionRange(idx + 1, idx + 1))
  showTopicList.value = true
  searchTopicList()
  handleGetPointerPosition(
    modelValue.value.slice(0, idx),
    modelValue.value.slice(idx)
  )
}

// 获取光标位置距离 textarea 元素左边和顶部 border 的距离
function handleGetPointerPosition(startStr: string, endStr: string) {
  const computedStyle = window.getComputedStyle(inputEl.value)
  const containerEl = document.createElement('div')
  const spanEl = document.createElement('span')
  containerEl.style.width = computedStyle.width
  containerEl.style.height = computedStyle.height
  containerEl.style.lineHeight = computedStyle.lineHeight
  containerEl.className =
    'invisible overflow-hidden absolute whitespace-pre-wrap'
  containerEl.textContent = startStr
  spanEl.textContent = endStr
  containerEl.appendChild(spanEl)
  document.body.appendChild(containerEl)
  topicPosition.x = spanEl.offsetLeft
  topicPosition.y =
    spanEl.offsetTop -
    inputEl.value.scrollTop +
    parseInt(computedStyle.borderTopWidth) +
    32
  // console.log(
  //   '=======handleGetPointerPosition=======',
  //   topicPosition,
  //   computedStyle.borderTopWidth
  // )
  document.body.removeChild(containerEl)
}

async function searchTopicList(keyword?: string) {
  try {
    const { result, success, msg } = await $HttpUtils.post('/topic/list', {
      keyword
    })
    if (success) {
      topicList.value = result.list
    }
  } catch (e) {}
}
</script>
