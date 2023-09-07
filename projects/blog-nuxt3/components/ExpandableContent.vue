<template>
  <div class="whitespace-pre-wrap break-words transition-all">
    <template v-for="(info, index) of displayContentList" :key="index">
      <span v-html="info.content" v-if="info.type === 'html'"></span>
      <span v-else>{{ info.content }}</span>
    </template>

    <MediaImgInlineView class="mx-[4px]" v-if="imgUrl" :url="imgUrl" />

    <n-button
      text
      type="primary"
      @click.stop="handleExpand"
      v-if="showAction"
      >{{ isExpanded ? '收起' : '展开' }}</n-button
    >
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { Topic } from 'sys-types'

interface Props {
  content?: string
  imgUrl?: string
  maxLength?: number
  maxLine?: number
  topic?: Topic[]
}

const runtimeConfig = useRuntimeConfig()
const props = withDefaults(defineProps<Props>(), {
  maxLength: 280,
  content: '',
  maxLine: 3,
  topic: () => []
})
const isExpanded = ref(false)
const scrollTop = ref(0)

const lineContentList = computed(() => {
  // console.log('======lineContentList========', props.content)
  // todo: 设置了默认值为什么 props.content 还是 null?
  if (!props.content) return []

  return props.content.split('\n')
})
const isMultiLines = computed(
  () => lineContentList.value.length > props.maxLine
)
const showAction = computed(() => {
  if (lineContentList.value.length > props.maxLine) return true

  return props.content?.length > props.maxLength
})
const displayContentList = computed(() => {
  if (!props.content) return []

  let preContent = '',
    result = []
  if (isExpanded.value) {
    preContent = `${props.content}${isMultiLines.value ? '\n' : ''}`
  } else {
    if (lineContentList.value.length > props.maxLine) {
      return (
        lineContentList.value.slice(0, props.maxLine).join('\n') + '\n...\n'
      )
    } else if (props.content && props.content.length > props.maxLength) {
      preContent = props.content.slice(0, props.maxLength) + '...'
    } else {
      preContent = props.content
    }
  }
  result.push({
    type: 'text',
    content: preContent
  })

  if (props.topic.length) {
    result = []
    // let strList = preContent.split(/(#[^#^\s]+?#)/g)
    const topicContentList = props.topic.map((t) => `#${t.content}#`)
    const reg = new RegExp(`(${topicContentList.join('|')})`, 'g')
    let strList = preContent.split(reg)
    strList.forEach((str) => {
      if (topicContentList.some((tc) => str === tc)) {
        const topicContent = str.slice(1, -1)
        const topic = props.topic.find((t) => t.content === topicContent)
        result.push({
          type: 'html',
          content: `<a href="${runtimeConfig.app.baseURL}search?topicId=${topic?.id}" class="text-green-700" target="_blank">${str}</a>`
        })
      } else {
        result.push({
          type: 'text',
          content: str
        })
      }
    })
  }

  return result
})

function handleExpand() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    scrollTop.value = window.scrollY
  } else {
    nextTick(() => {
      window.scrollTo(0, scrollTop.value)
    })
  }
}
</script>
