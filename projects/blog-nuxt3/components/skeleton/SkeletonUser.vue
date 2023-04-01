<template>
  <div
    class="index-skeleton divide-y divide-border-light dark:divide-border-dark"
  >
    <n-card>
      <div class="flex gap-12">
        <n-skeleton circle :width="80" :height="80"></n-skeleton>
        <div class="flex flex-col flex-1 gap-6">
          <n-skeleton text :width="120"></n-skeleton>
          <n-skeleton text :width="280"></n-skeleton>
          <n-skeleton text :width="80"></n-skeleton>
        </div>
        <div class="flex items-end">
          <n-skeleton text :width="80"></n-skeleton>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NSkeleton, NCard, NSpace } from 'naive-ui'
</script>
