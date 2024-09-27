<template>
  <div class="grid grid-cols-1 gap-[12px]">
    <div v-for="i in 15" :key="i" class="flex gap-[6px]">
      <el-skeleton :rows="1" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
