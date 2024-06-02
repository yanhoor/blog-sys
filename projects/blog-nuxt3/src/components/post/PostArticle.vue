<template>
  <div class="relative line-numbers whitespace-pre-wrap prose prism prose-stone dark:prose-invert" v-html="content"
       ref="containerRef"></div>
</template>

<script setup lang="ts">
import Prism from 'prismjs';
// import loadLanguages from 'prismjs/components/index'
import 'prismjs/components/prism-python.min';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php.min';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-css.min'
import 'prismjs/components/prism-c.min'
import 'prismjs/components/prism-csharp.min'
import 'prismjs/components/prism-java.min'
import 'prismjs/components/prism-haml.min'
import 'prismjs/components/prism-rust.min'
import 'prismjs/components/prism-sass.min'
import 'prismjs/components/prism-less.min'
import 'prismjs/components/prism-css.min'
import 'prismjs/components/prism-go.min'
import 'prismjs/components/prism-json.min'
import 'prismjs/components/prism-go.min'
import 'prismjs/components/prism-git.min'
import 'prismjs/components/prism-swift.min'
import 'prismjs/components/prism-markdown.min'
import 'prismjs/components/prism-markup.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'

interface Props {
  content: string;
}

const props = withDefaults(defineProps<Props>(), {
  // content: ""
});

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
  const href = colorMode.value === 'dark' ? "/blog/prism/prism-okaidia.min.css" : "/blog/prism/prism.css"
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
