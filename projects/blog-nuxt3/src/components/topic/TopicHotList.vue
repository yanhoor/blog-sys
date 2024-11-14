<template>
  <div class="topic-hot-list">
    <el-card v-if="pageList.length">
      <div class="flex items-center justify-between">
        <p class="text-[16px] font-semibold">热搜榜</p>
        <el-button
          text
          class="placeholder-text-color text-[12px]"
          @click="handleLoadNextPage(1)"
        >
          <template #icon>
            <Icon name="fluent:arrow-clockwise-20-regular" />
          </template>
          点击刷新</el-button
        >
      </div>
      <div v-auto-animate>
        <p
          v-for="(topic, index) of pageList"
          :key="topic.id"
          :title="topic.content"
          class="hover:text-primary flex max-w-full cursor-pointer items-center justify-start p-[6px]"
          @click="handleClickTopic(topic.id)"
        >
          <span
            class="mr-[6px] inline-block w-[20px] text-center text-[18px]"
            :class="[
              index < 3
                ? 'font-mono font-semibold italic text-red-500'
                : 'font-sans text-orange-400'
            ]"
            >{{ index + 1 }}</span
          >
          <span class="ellipsis-text flex-1">{{ topic.content }}</span>
        </p>
      </div>
      <SkeletonTopicList v-if="pageLoading" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { Topic } from 'sys-types'

const runtimeConfig = useRuntimeConfig()
const { pageList, pageLoading, handleLoadNextPage } = useListAppendFetch<Topic>(
  '/topic/list',
  { pageSize: 10 },
  {}
)

await handleLoadNextPage(1)

function handleClickTopic(topicId: string) {
  window.open(
    `${runtimeConfig.app.baseURL}/search?topicId=${topicId}`,
    'search'
  )
}
</script>
