<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      :to="{ path: item.path }"
      v-for="item of routeList"
      :key="item.path"
      >{{ item.meta.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const routeList = computed(() => {
  return route.path === '/home' ? route.matched.slice(1) : route.matched
})
</script>
