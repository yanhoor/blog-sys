<template>
  <div class="grid gap-[12px]">
    <el-card v-for="i in 20" :key="i">
      <el-skeleton :rows="3" />
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>
