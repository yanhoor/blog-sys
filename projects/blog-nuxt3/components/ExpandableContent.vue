<template>
  <div class="whitespace-pre-wrap break-words transition-all">
    {{ isExpanded ? content : getPostSummary(content) }}
    <n-button text type="primary" @click="isExpanded = !isExpanded" v-if="content?.length > maxLength">{{ isExpanded ? '收起' : '展开' }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui"
interface Props{
  content: string
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 280
})
const isExpanded = ref(false)

function getPostSummary(content: string) {
  if(content && content.length > props.maxLength){
    return content.slice(0, props.maxLength) + '...'
  }else{
    return content
  }
}
</script>
