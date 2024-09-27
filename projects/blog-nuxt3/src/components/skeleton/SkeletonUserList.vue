<template>
  <div class="space-y-[12px] px-[6px]">
    <div class="flex items-center gap-[12px]" v-for="i in 20" :key="i">
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
