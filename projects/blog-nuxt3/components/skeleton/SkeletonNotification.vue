<template>
  <div class="grid gap-[12px]">
    <n-card v-for="i in 20" :key="i">
      <n-space vertical>
        <n-space aling="center">
          <n-skeleton circle size="medium"></n-skeleton>
          <n-skeleton text :width="240"></n-skeleton>
        </n-space>
        <n-skeleton text width="100%"></n-skeleton>
      </n-space>
      <n-space justify="space-between">
        <n-skeleton text :width="160"></n-skeleton>
        <n-skeleton text :width="100"></n-skeleton>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {
  NSkeleton,
  NCard,
  NSpace
} from "naive-ui"

</script>
