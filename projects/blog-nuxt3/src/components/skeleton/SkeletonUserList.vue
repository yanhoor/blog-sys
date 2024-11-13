<template>
  <div class="space-y-[12px] px-[6px]">
    <div v-for="i in 20" :key="i" class="flex items-center gap-[12px]">
      <el-skeleton style="--el-skeleton-circle-size: 64px">
        <template #template>
          <el-skeleton-item variant="circle" />
        </template>
      </el-skeleton>
      <el-skeleton :rows="3" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
