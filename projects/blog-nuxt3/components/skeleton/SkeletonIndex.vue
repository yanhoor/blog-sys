<template>
  <div class="index-skeleton">
    <div v-for="i in 20" :key="i" class="py-[20px] px-0">
      <n-skeleton text size="medium"></n-skeleton>
      <n-space aling="center">
        <n-skeleton circle size="medium"></n-skeleton>
        <n-skeleton text :width="120"></n-skeleton>
        <n-skeleton text :width="160"></n-skeleton>
        <n-skeleton text :width="50"></n-skeleton>
        <n-skeleton text :width="50"></n-skeleton>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NSkeleton,
  NSpace
} from "naive-ui"

</script>

<style lang="scss" scoped>
.item-container{
  border-bottom: 1px solid var(--border-color);
}
</style>
