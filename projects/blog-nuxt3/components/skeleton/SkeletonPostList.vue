<template>
  <div class="grid grid-cols-1 gap-[12px]">
    <el-card v-for="i in 20" :key="i">
      <div class="flex flex-col items-start gap-[12px]">
        <div class="flex items-center justify-start gap-[6px]">
          <el-skeleton style="--el-skeleton-circle-size: 64px">
            <template #template>
              <el-skeleton-item variant="circle" />
            </template>
          </el-skeleton>
          <el-skeleton :rows="1" />
        </div>
      </div>
      <el-skeleton :rows="2" />
      <el-skeleton class="mt-[12px]">
        <template #template>
          <div class="grid grid-cols-3">
            <div class="flex justify-center">
              <el-skeleton-item variant="text" style="width: 80px" />
            </div>
            <div class="flex justify-center">
              <el-skeleton-item variant="text" style="width: 80px" />
            </div>
            <div class="flex justify-center">
              <el-skeleton-item variant="text" style="width: 80px" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>
