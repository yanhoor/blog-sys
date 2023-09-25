<template>
  <div class="relative w-full">
    <n-input
      id="nInput"
      :value="modelValue"
      @input="handleInput"
      @blur="showTopicList = false"
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
      <n-collapse-transition :show="showTopicList">
        <div class="max-h-[400px] overflow-auto rounded border border-primary">
          <p class="px-[12px] py-[5px] text-primary">想用什么话题</p>
          <p
            v-for="topic of topicList"
            :key="topic.id"
            class="px-[12px] py-[5px] hover:bg-primary hover:text-white"
            @click="handleSelectTopic(topic.content)"
          >
            {{ topic.content }}
          </p>
        </div></n-collapse-transition
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCollapseTransition, NInput } from 'naive-ui'
import { Topic } from 'sys-types'

interface Props {
  placeholder?: string
  modelValue?: string
  showCount?: boolean
  autosize?: {
    minRows: number
    maxRows: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容',
  showCount: true,
  autosize: {
    minRows: 5,
    maxRows: 15
  }
})
const emits = defineEmits<{
  'update:modelValue': [v: string]
}>()
const inputEl = ref<HTMLTextAreaElement>()
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
  inputEl.value = document.querySelector('#nInput textarea')
  // console.log('========topic mounted========', inputEl.value)
  inputEl.value.addEventListener('click', handleFocus)
  if (props.modelValue) {
    // 对于转发微博，已经有部分内容，将光标移到前面
    inputEl.value.focus()
    inputEl.value.setSelectionRange(0, 0)
  }
})
onUnmounted(() => {
  inputEl.value.removeEventListener('click', handleFocus)
})

function handleFocus() {
  handleInput()
}

function handleInput(val: string = props.modelValue) {
  emits('update:modelValue', val)
  const textarea = inputEl.value
  const idx = val.lastIndexOf('#', textarea.selectionEnd - 1)
  const range = val.slice(idx, textarea.selectionEnd) // 获取 # 与 光标之间的文本
  // 以#结尾或以#+非空格+任意字符结尾(即排除 #+空格+字符)
  if (/^#[^@\[\]\s]*$/g.test(range)) {
    showTopicList.value = true
    searchTopicList(range.slice(1))
    handleGetPointerPosition(
      props.modelValue.slice(0, textarea.selectionEnd),
      props.modelValue.slice(textarea.selectionEnd)
    )
  } else {
    showTopicList.value = false
  }
}

function handleSelectTopic(topic: string) {
  const textarea = inputEl.value
  const idx = props.modelValue.lastIndexOf('#', textarea.selectionEnd)
  const val = [
    props.modelValue.slice(0, idx + 1),
    `${topic}# `,
    props.modelValue.slice(textarea.selectionEnd)
  ].join('')
  showTopicList.value = false
  inputEl.value.focus()
  nextTick(() => {
    const index = idx + 3 + topic.length
    textarea.setSelectionRange(index, index)
  })
  emits('update:modelValue', val)
}

function handleAddTopic() {
  const textarea = inputEl.value
  const idx = textarea.selectionEnd
  // 在光标处插入 #
  const val = [
    props.modelValue.slice(0, idx),
    '#',
    props.modelValue.slice(idx)
  ].join('')
  emits('update:modelValue', val)
  // 插入完成后将光标移到 # 后
  textarea.focus()
  nextTick(() => textarea.setSelectionRange(idx + 1, idx + 1))
  showTopicList.value = true
  searchTopicList()
  handleGetPointerPosition(
    props.modelValue.slice(0, idx),
    props.modelValue.slice(idx)
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
    const { result, success, msg } = await useFetchPost('/topic/list', {
      keyword
    })
    if (success) {
      topicList.value = result.list
    }
  } catch (e) {}
}
</script>
