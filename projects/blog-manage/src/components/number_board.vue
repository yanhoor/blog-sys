<template>
  <el-card class="number-board-container">
    <div class="text-gray-400">{{ props.title }}</div>
    <div class="mt-6 text-3xl font-bold">{{ props.count }}</div>
  </el-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  count: string | number
}

const props = defineProps<Props>()
</script>
