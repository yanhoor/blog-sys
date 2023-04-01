<template>
  <div class="blog-skeleton">
    <n-card>
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

      <div class="mt-[20px]">
        <div class="flex items-start gap-[12px] mt-[12px]" v-for="i of 20">
          <n-skeleton circle size="small"></n-skeleton>
          <n-space vertical class="w-full">
            <n-skeleton text :width="160"></n-skeleton>
            <n-skeleton text width="100%"></n-skeleton>
            <n-skeleton text width="100%"></n-skeleton>
            <n-skeleton text :width="100"></n-skeleton>
          </n-space>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSkeleton, NSpace } from 'naive-ui'
</script>
