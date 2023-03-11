<template>
  <n-input placeholder="搜索关键字" :value="value" @update:value="handleValueUpdate" clearable @keyup.enter="handleConfirm">
    <template #prefix>
      <n-icon class="cursor-pointer" :component="Search12Regular" @click="handleConfirm"/>
    </template>
  </n-input>
</template>

<script setup lang="ts">
import {
  NInput,
  NIcon,
} from "naive-ui"
import { Search12Regular } from '@vicons/fluent'

interface Props{
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
