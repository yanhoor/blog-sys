<template>
  <el-card class="number-board-container">
    <div class="text-gray-400">{{ props.title }}</div>
    <div class="font-bold text-3xl mt-6">{{ props.count }}</div>
  </el-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  count: string | number
}

const props = defineProps<Props>()
</script>
