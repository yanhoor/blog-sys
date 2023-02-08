<template>
  <div class="user-image-wall">
    <div class="w-full h-full flex flex-wrap" v-if="pageLoading && pageFetchParams.page === 1">
      <div class="img-wrapper" v-for="i of 30">
        <div class="img-container">
          <n-skeleton width="100%" height="100%" class="absolute top-0"/>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-wrap items-start w-full -mt-[6px] -ml-[6px]" v-loadMore="handleLoadNextPage">
        <div class="img-wrapper" v-for="image of pageList" :key="image.id">
          <div class="img-container" @click="handlePreview(image)">
            <MediaImgView class="media-item" :url="image.url" ratio="70"/>
          </div>
        </div>
      </div>
      <div class="w-full text-center mt-[20px]" v-if="pageLoading">
        <n-spin :size="24"/>
      </div>
      <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)"/>
      <ResultEmpty v-else-if="pageList.length === 0" @refresh="handleLoadNextPage(1)"/>
      <ResultNoMore v-else-if="pageLoadedFinish"/>
    </div>
    <n-back-top :right="50"/>
    <MediaPreview :media="curMedia" v-model:show="showPreview" is-img/>
  </div>
</template>

<script setup lang="ts">
import { Media } from '@/types'
import {
  NResult,
  NBackTop,
  NSpin,
  NSkeleton
} from "naive-ui"

interface Props{
  userId: number
}
const props = defineProps<Props>()
const curMedia = ref<Media>()
const showPreview = ref(false)
const { pageFetchParams, pageList, pageLoading, fetchResult, pageLoadedFinish, handleLoadNextPage } = useListAppendFetch<Media>('/user/getMediaList', { type: 1, userId: props.userId }, {})

handleLoadNextPage()

function handlePreview(m: Media) {
  curMedia.value = m
  showPreview.value = true
}
</script>

<style lang="scss" scoped>
.img-wrapper{
  @apply w-1/5 pt-[6px] pl-[6px];
  .img-container{
    border-radius: 5px;
    @apply relative w-full;
    padding-top: 100%;
    .media-item{
      @apply w-full h-full object-cover overflow-clip absolute top-0 cursor-pointer;
      border-radius: inherit; // 图片圆角
    }
  }
}
</style>
