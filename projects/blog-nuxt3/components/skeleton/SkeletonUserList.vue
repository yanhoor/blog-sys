<template>
  <div class="px-[6px] space-y-[12px]">
    <div class="flex items-center gap-[12px]" v-for="i in 20" :key="i">
      <n-skeleton circle size="large"></n-skeleton>
      <div class="flex-1 flex flex-col items-start gap-[6px]">
        <n-skeleton text :width="100" :height="10"></n-skeleton>
        <n-skeleton text :width="180" :height="10"></n-skeleton>
      </div>
      <n-skeleton text :width="80"></n-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSkeleton, NCard, NSpace } from 'naive-ui'
</script>
