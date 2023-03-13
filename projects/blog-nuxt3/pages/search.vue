<template>
  <div>
    <!--todo: 深色下刷新，颜色变化有过渡-->
    <n-tabs class="p-[20px] pb-0 sticky top-[60px] z-10 bg-card-light dark:bg-card-dark" type="line" v-model:value="searchParams.sort" @update:value="handleSearch">
      <n-tab name="1">综合排序</n-tab>
      <n-tab name="2">最新优先</n-tab>
      <n-tab name="3">最热优先</n-tab>
      <template #suffix>
        <n-select class="w-[200px]" v-model:value="selectTime" :options="timeOptions" @update:value="handleTimeSelect"></n-select>
      </template>
    </n-tabs>
    <PostList ref="blogListRef" :searchParams="searchParams"/>
  </div>
</template>

<script setup lang="ts">
import {
  NTabs,
  NTab,
  NButton,
  NSelect
} from "naive-ui"
import dayjs from "dayjs"

useHead({
  title: '搜索',
})
definePageMeta({
  key: (route) => route.fullPath
})
const route = useRoute()
const selectTime = ref('0')
const blogListRef = ref()
const searchParams = reactive({
  keyword: route.query.keyword,
  startTime: '',
  endTime: '',
  sort: 1,
})
const timeOptions = [
  { label: '时间不限', value: '0' },
  { label: '最近一天', value: '1' },
  { label: '最近一周', value: '2' },
  { label: '最近三个月', value: '3' },
]

function handleTimeSelect() {
  switch (selectTime.value) {
    case '0':
      searchParams.startTime = ''
      searchParams.endTime = ''
      break
    case '1':
      searchParams.startTime = dayjs().subtract(24, 'h').toString()
      searchParams.endTime = dayjs().toString()
      break
    case '2':
      searchParams.startTime = dayjs().subtract(7, 'd').endOf('date').toString()
      searchParams.endTime = dayjs().endOf('date').toString()
      break
    case '3':
      searchParams.startTime = dayjs().subtract(90, 'd').endOf('date').toString()
      searchParams.endTime = dayjs().endOf('date').toString()
      break
  }
  handleSearch()
}
async function handleSearch() {
  blogListRef.value.handleChangeFetchParams(searchParams)
  blogListRef.value.handleLoadNextPage(1)
}
</script>

<style lang="scss" scoped>
.n-card{
  :deep(.n-card__content){
    padding-top: 0;
  }
}
</style>
