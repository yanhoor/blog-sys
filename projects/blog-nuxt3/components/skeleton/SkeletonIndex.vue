<template>
  <div class="index-skeleton">
    <div v-for="i in 20" :index="i" class="item-container">
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
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
}
</style>
