<template>
  <div class="grid grid-cols-1 gap-[12px]">
    <div v-for="i in 15" :key="i" class="flex gap-[6px]">
      <n-skeleton text :width="30"></n-skeleton>
      <n-skeleton text class="flex-1"></n-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSkeleton, NCard, NSpace } from 'naive-ui'
</script>
