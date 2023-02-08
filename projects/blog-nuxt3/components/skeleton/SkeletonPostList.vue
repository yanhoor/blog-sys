<template>
  <div class="grid grid-cols-1 gap-[12px]">
    <n-card v-for="i in 20" :key="i">
      <div class="flex flex-col items-start gap-[12px]">
        <div class="flex justify-start items-center gap-[6px]">
          <n-skeleton circle size="large"></n-skeleton>
          <n-space vertical>
            <n-skeleton text :width="160"></n-skeleton>
            <n-skeleton text :width="100"></n-skeleton>
          </n-space>
        </div>
      </div>
      <n-skeleton text width="100%"></n-skeleton>
      <n-skeleton text width="100%"></n-skeleton>
      <n-skeleton text :width="160"></n-skeleton>
      <div class="grid grid-cols-3 mt-[12px]">
        <div class="flex justify-center">
          <n-skeleton text :width="80"></n-skeleton>
        </div>
        <div class="flex justify-center">
          <n-skeleton text :width="80"></n-skeleton>
        </div>
        <div class="flex justify-center">
          <n-skeleton text :width="80"></n-skeleton>
        </div>
      </div>
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

