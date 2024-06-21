<template>
  <div
    class="line-numbers prism prose prose-stone relative whitespace-pre-wrap dark:prose-invert"
    v-html="content"
    ref="containerRef"
  ></div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'

interface Props {
  content: string
}

const props = withDefaults(defineProps<Props>(), {
  // content: ""
})

const containerRef = ref()
const colorMode = useColorMode()

// todo: 为什么切换显示模式会触发两次
watch(colorMode, handleHighlightCode)

onMounted(() => {
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

<style lang="css">
@import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css';
</style>
