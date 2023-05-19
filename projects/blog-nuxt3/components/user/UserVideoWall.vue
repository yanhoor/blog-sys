<template>
  <div class="user-video-wall">
    <div
      class="w-full h-full flex flex-wrap"
      v-if="pageLoading && pageFetchParams.page === 1"
    >
      <div class="img-wrapper" v-for="i of 30">
        <div class="img-container">
          <n-skeleton width="100%" height="100%" class="absolute top-0" />
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="flex flex-wrap items-start w-full -mt-[6px] -ml-[6px]"
        v-loadMore="handleLoadNextPage"
      >
        <div class="img-wrapper" v-for="media of pageList" :key="media.id">
          <div class="img-container" @click="handlePreview(media)">
            <video
              class="media-item"
              :src="config.public.imageBase + media.file.url"
            ></video>
            <n-icon class="play-icon" :component="Play24Filled" size="48" />
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
import { Media } from 'sys-types'
import { NIcon, NResult, NSkeleton, NSpin } from 'naive-ui'
import { Play24Filled } from '@vicons/fluent'

interface Props {
  userId: number
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

<style lang="scss" scoped>
.img-wrapper {
  @apply w-1/5 pt-[6px] pl-[6px];
  .img-container {
    border-radius: 5px;
    @apply relative w-full;
    padding-top: 100%;
    .media-item {
      @apply w-full h-full object-cover overflow-clip absolute top-0 cursor-pointer;
      border-radius: inherit; // 图片圆角
    }
    .play-icon {
      @apply top-1/2 left-1/2 absolute cursor-pointer text-white;
      transform: translate(-50%, -50%);
      &:hover {
        @apply text-green-600;
      }
    }
  }
}
</style>
