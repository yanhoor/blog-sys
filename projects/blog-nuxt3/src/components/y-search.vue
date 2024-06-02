<template>
  <el-input
    v-bind="$attrs"
    placeholder="搜索关键字"
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
const emits = defineEmits(['confirm'])

function handleConfirm() {
  emits('confirm')
}
</script>
