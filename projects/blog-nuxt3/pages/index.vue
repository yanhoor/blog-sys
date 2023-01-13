<template>
  <div>
    <n-card>
      <BlogList />
    </n-card>

    <div class="mt-20 text-center text-gray-400">
      <a href="http://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" class="hover:text-green-700">粤ICP备2022151349号</a>
    </div>
  </div>
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

