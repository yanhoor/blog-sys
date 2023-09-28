<template>
  <div class="result-empty flex w-full flex-col items-center gap-[12px]">
    <Icon
      name="fluent:error-circle-24-filled"
      :size="size"
      color="#36ad6a"
    ></Icon>
    <p class="text-[16px] font-semibold">{{ msg }}</p>
    <n-button type="primary" @click="emits('refresh')">刷新</n-button>
  </div>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui'

interface Props {
  size?: string
  msg?: string
}
const emits = defineEmits(['refresh'])
const props = withDefaults(defineProps<Props>(), {
  size: '150px',
  msg: '出错了，请稍后重试'
})
</script>

<style lang="postcss" scoped></style>
