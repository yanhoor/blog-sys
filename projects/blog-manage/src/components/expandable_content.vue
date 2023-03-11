<template>
  <div class="whitespace-pre-wrap break-words transition-all">
    {{ isExpanded ? content : getPostSummary(content) }}
    <el-button text type="primary" @click.stop="handleExpand" v-if="showAction">{{ isExpanded ? '收起' : '展开' }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

interface Props{
  content: string
  maxLength?: number
  maxLine?: number
  showBtn: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBtn: true,
  maxLength: 280,
  maxLine: 3
})
const isExpanded = ref(false)
const scrollTop = ref(0)

const lineContentList = computed(() => {
  return props.content.split('\n')
})
const showAction = computed(() => {
  if(!props.showBtn) return false

  if(lineContentList.value.length > props.maxLine) return true

  return props.content?.length > props.maxLength

})

function getPostSummary(content: string) {
  if(lineContentList.value.length > props.maxLine){
    return lineContentList.value.slice(0, props.maxLine).join('\n') + '\n...'
  }else if(content && content.length > props.maxLength){
    return content.slice(0, props.maxLength) + '...'
  }else{
    return content
  }
}

function handleExpand() {
  isExpanded.value = !isExpanded.value
  // if(isExpanded.value){
  //   scrollTop.value = window.scrollY
  // } else{
  //   nextTick(() => {
  //     window.scrollTo(0, scrollTop.value)
  //   })
  // }
}
</script>
