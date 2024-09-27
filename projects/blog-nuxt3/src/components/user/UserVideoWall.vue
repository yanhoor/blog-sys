<template>
  <div class="user-video-wall">
    <div
      class="flex h-full w-full flex-wrap"
      v-if="pageLoading && pageFetchParams.page === 1"
    >
      <div class="img-wrapper" v-for="i of 30">
        <div class="img-container">
          <el-skeleton class="absolute top-0 h-full w-full">
            <template #template>
              <el-skeleton-item variant="image" class="h-full w-full" />
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="-ml-[6px] -mt-[6px] flex w-full flex-wrap items-start"
        v-loadMore="handleLoadNextPage"
        v-auto-animate
      >
        <div class="img-wrapper" v-for="media of pageList" :key="media.id">
          <div class="img-container" @click="handlePreview(media)">
            <video
              class="media-item"
              :src="config.public.imageBase + media.file.url"
            ></video>
            <Icon
              name="fluent:play-24-filled"
              class="play-icon"
              size="48"
            ></Icon>
          </div>
        </div>
      </div>
      <ResultLoading v-if="pageLoading" />
      <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)" />
      <ResultEmpty
        v-else-if="pageList.length === 0"
        @refresh="handleLoadNextPage(1)"
      />
      <ResultNoMore v-else-if="pageLoadedFinish" />
    </div>
    <MediaPreview
      :file="curMedia?.file"
      v-model:show="showPreview"
      v-if="curMedia"
    />
  </div>
</template>

<script setup lang="ts">
import type { Media } from 'sys-types'

interface Props {
  userId: string
}
const props = defineProps<Props>()
const config = useRuntimeConfig()
const curMedia = ref<Media>()
const showPreview = ref(false)
const {
  pageFetchParams,
  pageList,
  pageLoading,
  pageLoadedFinish,
  fetchResult,
  handleLoadNextPage
} = useListAppendFetch<Media>(
  '/user/getMediaList',
  { type: 2, userId: props.userId },
  {}
)

handleLoadNextPage()

function handlePreview(m: Media) {
  curMedia.value = m
  showPreview.value = true
}
</script>

<style lang="postcss" scoped>
.img-wrapper {
  @apply w-1/5 pl-[6px] pt-[6px];
  .img-container {
    border-radius: 5px;
    @apply relative w-full;
    padding-top: 100%;
    .media-item {
      @apply absolute top-0 h-full w-full cursor-pointer overflow-clip object-cover;
      border-radius: inherit;
    }
    .play-icon {
      @apply absolute left-1/2 top-1/2 cursor-pointer text-white;
      transform: translate(-50%, -50%);
      &:hover {
        @apply text-green-600;
      }
    }
  }
}
</style>
