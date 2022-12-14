<template>
  <NuxtLayout>
    <template #left>
      <h3>dedwefwf</h3>
    </template>

    <n-card>
      <BlogList />
    </n-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  NCard
} from "naive-ui"

useHead({
  title: '首页',
  meta: [
    { name: "keywords", content: "vue3, nuxt3, ssr, naive ui, tailwind css" },
    { name: "description", content: "基于vue3的nuxt3框架SSR博客站点首页" },
  ],
})
definePageMeta({
  pageTransition: false,
})
</script>

