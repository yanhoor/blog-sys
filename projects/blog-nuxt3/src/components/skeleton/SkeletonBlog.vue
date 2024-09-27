<template>
  <div class="blog-skeleton">
    <el-card>
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

      <div class="mt-[20px]">
        <div class="mt-[12px] flex items-start gap-[12px]" v-for="i of 20">
          <el-skeleton style="--el-skeleton-circle-size: 32px">
            <template #template>
              <el-skeleton-item variant="circle" />
            </template>
          </el-skeleton>
          <el-skeleton :rows="3" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>
