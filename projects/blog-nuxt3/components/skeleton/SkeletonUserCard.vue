<template>
  <div class="flex flex-col gap-12 p-[12px]">
    <div class="flex items-center gap-[6px]">
      <n-skeleton circle :width="30" :height="30"></n-skeleton>
      <div class="flex flex-col items-start">
        <n-skeleton text :width="80"></n-skeleton>
        <n-skeleton text :width="120"></n-skeleton>
      </div>
    </div>
    <n-skeleton text width="100%"></n-skeleton>
    <div class="flex justify-around gap-[12px]">
      <div class="flex flex-col items-center">
        <n-skeleton text :width="40"></n-skeleton>
        <n-skeleton text :width="80"></n-skeleton>
      </div>
      <div class="flex flex-col items-center">
        <n-skeleton text :width="40"></n-skeleton>
        <n-skeleton text :width="80"></n-skeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NSkeleton
} from "naive-ui"

</script>

