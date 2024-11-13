<template>
  <div
    class="index-skeleton divide-border-light dark:divide-border-dark divide-y"
  >
    <el-card>
      <div class="flex gap-12">
        <el-skeleton style="--el-skeleton-circle-size: 80px">
          <template #template>
            <el-skeleton-item variant="circle" />
          </template>
        </el-skeleton>

        <el-skeleton :rows="3" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>
