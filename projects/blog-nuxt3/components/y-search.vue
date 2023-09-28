<template>
  <n-input
    placeholder="搜索关键字"
    :value="value"
    @update:value="handleValueUpdate"
    clearable
    @keyup.enter="handleConfirm"
  >
    <template #prefix>
      <Icon
        name="fluent:search-20-regular"
        class="cursor-pointer"
        @click="handleConfirm"
      ></Icon>
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'

interface Props {
  value: string
}
const props = defineProps<Props>()
const emits = defineEmits(['update:value', 'confirm'])

function handleValueUpdate(v: string) {
  emits('update:value', v)
}

function handleConfirm() {
  emits('confirm')
}
</script>
