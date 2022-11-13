<template>
  <div class="blog-skeleton">
    <n-skeleton text size="medium"></n-skeleton>
    <n-skeleton text width="40%" size="medium"></n-skeleton>
    <n-space aling="center">
      <n-skeleton circle size="medium"></n-skeleton>
      <n-skeleton text :width="120"></n-skeleton>
      <n-skeleton text :width="200"></n-skeleton>
    </n-space>
    <n-skeleton text :repeat="30"></n-skeleton>
    <n-skeleton text width="60%"></n-skeleton>
  </div>
</template>

<script setup lang="ts">
import {
  NSkeleton,
  NSpace
} from "naive-ui"

</script>
