<template>
  <div class="result-empty flex w-full flex-col items-center gap-[12px]">
    <n-icon :component="ErrorCircle24Filled" :size="size" color="#36ad6a" />
    <p class="text-[16px] font-semibold">出错了，请稍后重试</p>
    <n-button type="primary" @click="emits('refresh')">刷新</n-button>
  </div>
</template>

<script lang="ts" setup>
import { NIcon, NButton } from 'naive-ui'
import { ErrorCircle24Filled } from '@vicons/fluent'

interface Props {
  size?: string
}
const emits = defineEmits(['refresh'])
const props = withDefaults(defineProps<Props>(), {
  size: '150px'
})
</script>

<style lang="postcss" scoped></style>
