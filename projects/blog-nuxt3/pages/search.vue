<template>
  <n-card>
    <!--todo: 深色下刷新，颜色变化有过渡-->
    <n-tabs class="pt-[20px] sticky top-[60px] z-10 bg-card-light dark:bg-card-dark" type="line" v-model:value="searchParams.sort" @update:value="handleSearch">
      <n-tab name="1">综合排序</n-tab>
      <n-tab name="2">最新优先</n-tab>
      <n-tab name="3">最热优先</n-tab>
      <template #suffix>
        <n-select class="w-[200px]" v-model:value="searchParams.time" :options="timeOptions" @update:value="handleSearch"></n-select>
      </template>
    </n-tabs>
    <PostList :searchParams="searchParams"/>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NRow,
  NCol,
  NTabs,
  NTab,
  NButton,
  NSelect
} from "naive-ui"

useHead({
  title: '搜索',
})
definePageMeta({
  key: (route) => route.fullPath
})
const route = useRoute()
const searchParams = reactive({
  keyword: route.query.keyword,
  time: route.query.time || '0',
  sort: route.query.sort || 1,
})
const timeOptions = [
  { label: '时间不限', value: '0' },
  { label: '最近一天', value: '1' },
  { label: '最近一周', value: '2' },
  { label: '最近三个月', value: '3' },
]

async function handleSearch() {
  await navigateTo({ path: '/search', query: searchParams })
}
</script>

<style lang="scss" scoped>
.n-card{
  :deep(.n-card__content){
    padding-top: 0;
  }
}
</style>
