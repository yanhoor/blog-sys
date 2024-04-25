<template>
  <div class="user-image-wall">
    <div
      class="flex h-full w-full flex-wrap"
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
        class="-ml-[6px] -mt-[6px] flex w-full flex-wrap items-start"
        v-loadMore="handleLoadNextPage"
        v-auto-animate
      >
        <div class="img-wrapper" v-for="image of pageList" :key="image.id">
          <div class="img-container" @click="handlePreview(image)">
            <MediaImgView class="media-item" :url="image.file.url" ratio="10" />
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
    <n-back-top :right="50" />
    <MediaPreview
      :file="curMedia?.file"
      v-model:show="showPreview"
      is-img
      v-if="curMedia"
    />
  </div>
</template>

<script setup lang="ts">
import type { Media } from 'sys-types'
import { NResult, NBackTop, NSpin, NSkeleton } from 'naive-ui'

interface Props {
  userId: string
}
const props = defineProps<Props>()
const curMedia = ref<Media>()
const showPreview = ref(false)
const {
  pageFetchParams,
  pageList,
  pageLoading,
  fetchResult,
  pageLoadedFinish,
  handleLoadNextPage
} = useListAppendFetch<Media>(
  '/user/getMediaList',
  { type: 1, userId: props.userId },
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
      @apply absolute top-0 h-full w-full cursor-pointer overflow-clip object-cover transition duration-300 ease-out hover:z-10 hover:scale-105;
      border-radius: inherit;
    }
  }
}
</style>
