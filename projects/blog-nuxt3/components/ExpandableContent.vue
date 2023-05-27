<template>
  <div class="whitespace-pre-wrap break-words transition-all">
    <span v-if="content">{{
      isExpanded
        ? `${content}${isMultiLines ? '\n' : ''}`
        : getPostSummary(content)
    }}</span>

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

interface Props {
  content?: string
  imgUrl?: string
  maxLength?: number
  maxLine?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 280,
  content: '',
  maxLine: 3
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

function getPostSummary(content: string) {
  if (lineContentList.value.length > props.maxLine) {
    return lineContentList.value.slice(0, props.maxLine).join('\n') + '\n...\n'
  } else if (content && content.length > props.maxLength) {
    return content.slice(0, props.maxLength) + '...'
  } else {
    return content
  }
}

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
