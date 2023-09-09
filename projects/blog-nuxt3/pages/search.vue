<template>
  <div class="search-result flex items-start gap-[12px]">
    <n-card class="sticky top-[80px] w-[240px]">
      <p class="text-[16px] font-semibold">搜索结果</p>
      <CustomCollapse
        title="排序"
        :options="[
          { label: '综合排序', value: 1 },
          { label: '最新优先', value: 2 },
          { label: '最热优先', value: 3 }
        ]"
        v-model="searchParams.sort"
        @change="handleSearch"
      >
        <template #icon>
          <n-icon :component="Filter16Regular" size="18"
        /></template>
      </CustomCollapse>
      <CustomCollapse
        title="发布时间"
        :options="[
          { label: '时间不限', value: '0' },
          { label: '最近一天', value: '1' },
          { label: '最近一周', value: '2' },
          { label: '最近三个月', value: '3' }
        ]"
        v-model="selectTime"
        @change="handleTimeSelect"
      >
        <template #icon>
          <n-icon :component="CalendarLtr16Regular" size="18"
        /></template>
      </CustomCollapse>
      <CustomCollapse
        title="内容类型"
        :options="[
          { label: '全部', value: '' },
          { label: '视频', value: 'video' },
          { label: '音频', value: 'audio' },
          { label: '图片', value: 'image' }
        ]"
        v-model="searchParams.mediaType"
        @change="handleSearch"
      >
        <template #icon>
          <n-icon :component="Attach16Regular" size="18"
        /></template>
      </CustomCollapse>
      <div
        v-if="!searchParams.topicId"
        class="group group mt-[6px] flex w-full cursor-pointer justify-between"
        @click="handleSearchTopic(1)"
      >
        <div class="flex flex-1 items-center gap-[4px] hover:text-primary">
          <n-icon :component="NumberSymbolSquare20Regular" size="18" />
          <p
            :class="{ 'text-primary': searchParams.isTopic }"
            class="text-left"
          >
            话题
          </p>
        </div>
        <n-button
          text
          size="tiny"
          class="placeholder-text-color"
          v-if="searchParams.isTopic"
          @click.stop="handleSearchTopic(0)"
          >清除</n-button
        >
      </div>
    </n-card>
    <PostList class="flex-1" ref="blogListRef" :searchParams="searchParams" />
    <TopicHotList class="sticky top-[80px] w-[280px]" />
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NIcon } from 'naive-ui'
import {
  Filter16Regular,
  CalendarLtr16Regular,
  NumberSymbolSquare20Regular,
  Attach16Regular
} from '@vicons/fluent'
import dayjs from 'dayjs'

useHead({
  title: '搜索'
})
definePageMeta({
  key: (route) => route.fullPath
})
const route = useRoute()
const selectTime = ref('0')
const blogListRef = ref(null)
const searchParams = reactive({
  keyword: route.query.keyword,
  topicId: route.query.topicId,
  startTime: '',
  endTime: '',
  mediaType: '',
  isTopic: 0,
  sort: 1
})

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
      searchParams.startTime = dayjs()
        .subtract(90, 'd')
        .endOf('date')
        .toString()
      searchParams.endTime = dayjs().endOf('date').toString()
      break
  }
  handleSearch()
}
async function handleSearch() {
  blogListRef.value.handleChangeFetchParams(searchParams)
}

function handleSearchTopic(val: number) {
  searchParams.isTopic = val
  handleSearch()
}
</script>
