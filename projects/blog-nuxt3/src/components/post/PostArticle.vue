<template>
  <div class="relative" ref="wrapperRef">
    <div
        class="line-numbers prism prose prose-stone relative whitespace-pre-wrap dark:prose-invert w-full max-w-full"
        v-html="content"
        ref="containerRef"
    ></div>
    <div class="absolute top-0 left-0 right-0 bottom-0 more-mask" v-if="showHideMore">
      <el-button class="absolute bottom-[24px] left-1/2 -translate-x-1/2" link type="primary" @click="emits('seeMore')">点击查看更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'

interface Props {
  content: string
  hideMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideMore: false
})
const emits = defineEmits(['seeMore'])
const wrapperRef = ref()
const containerRef = ref()
const showHideMore = ref(false)
const colorMode = useColorMode()

// todo: 为什么切换显示模式会触发两次
watch(colorMode, handleHighlightCode)

onMounted(() => {
  const overHeight = wrapperRef.value.clientHeight < containerRef.value.offsetHeight
  showHideMore.value = overHeight && props.hideMore
  handleHighlightCode()
})

function handleHighlightCode() {
  Prism.highlightAllUnder(containerRef.value)
  let themeLink: HTMLLinkElement | null = document.querySelector('#prismaTheme')
  const href =
    colorMode.value === 'dark'
      ? '/blog/prism/prism-okaidia.min.css'
      : '/blog/prism/prism.css'
  if (themeLink) {
    themeLink.href = href
  } else {
    themeLink = document.createElement('link')
    themeLink.href = href
    themeLink.rel = 'stylesheet'
    themeLink.id = 'prismaTheme'
    document.head.appendChild(themeLink)
  }
}
</script>

<style lang="css" scoped>
@import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css';

.more-mask{
  background: linear-gradient(180deg,hsla(0,0%,100%,0) 7%,#fff);
}
</style>
