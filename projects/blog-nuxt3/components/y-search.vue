<template>
  <el-input
    placeholder="搜索关键字"
    :value="value"
    @change="handleValueUpdate"
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
  </el-input>
</template>

<script setup lang="ts">
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
