<template>
  <div class="flex flex-col gap-12 p-[12px]">
    <div class="flex items-center gap-[6px]">
      <el-skeleton style="--el-skeleton-circle-size: 30px">
        <template #template>
          <el-skeleton-item variant="circle" />
        </template>
      </el-skeleton>
    </div>
    <el-skeleton :rows="3" />
  </div>
</template>

<script setup lang="ts"></script>
