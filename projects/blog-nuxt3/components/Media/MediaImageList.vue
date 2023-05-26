<template>
  <div class="flex flex-wrap gap-[12px]" v-bind="$attrs">
    <div class="relative h-full w-full pt-[24px]" v-if="isPreview">
      <div class="toolbar-container">
        <div class="toolbar-item" @click="() => (isPreview = false)">
          <n-icon :component="ZoomOut24Regular" size="20"></n-icon>
          <span>收起</span>
        </div>
        <div class="toolbar-item" @click="handleZoomIn">
          <n-icon :component="ImageMultiple24Regular" size="20"></n-icon>
          <span>查看大图</span>
        </div>
      </div>
      <div
        class="preview-item-control left-pre left-0"
        @click="handleNextPreview(-1)"
        v-if="currentPreviewIndex > 0"
      ></div>
      <div class="relative h-0 w-full rounded-[5px] pt-[100%]">
        <MediaImgView
          class="radius-inherit absolute top-0 h-full w-full cursor-zoom-out object-cover"
          :url="currentPreviewItem.url"
          @click="handleCancelPreview"
        />
      </div>
      <div
        class="preview-item-control right-pre right-0"
        @click="handleNextPreview(1)"
        v-if="currentPreviewIndex !== imageList.length - 1"
      ></div>
    </div>

    <!--图片预览下面的小图-->
    <MediaNavigator
      v-model="currentPreviewItem"
      :page-size="12"
      :list="imageList"
      @itemChange="handlePreviewItemChange"
      v-if="isPreview"
    />

    <!--图片列表-->
    <div class="-ml-[6px] -mt-[6px] flex w-full flex-wrap" v-else>
      <div
        class="group relative w-1/5 cursor-zoom-in pl-[6px] pt-[6px]"
        v-for="(media, index) of imageList"
        :key="media.file.url"
        @click="handlePreview(media.file, index, true)"
      >
        <div class="image-item-container" v-if="index < 10">
          <MediaImgView class="image-item" :url="media.file.url" ratio="80" />
          <div
            class="list-item-mask bg-gray-200 group-hover:inline-block"
            :class="[
              imageList.length > 10 && index === 9
                ? 'num-mask'
                : 'hidden opacity-10'
            ]"
          ></div>
        </div>
        <span
          class="overflow-num text-white"
          v-if="imageList.length > 10 && index === 9"
          >+{{ imageList.length - 10 }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Media, MediaFile } from 'sys-types'
import { ImageMultiple24Regular, ZoomOut24Regular } from '@vicons/fluent'
import { NIcon } from 'naive-ui'
import { api as viewerApi } from 'v-viewer'

interface Props {
  imageList: Media[]
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const isPreview = ref(false)
const currentPreviewItem = ref<MediaFile>()
const currentPreviewIndex = ref<number>()
const scrollY = ref(0)

function handlePreview(f: MediaFile, idx: number, record?: boolean) {
  if (record) scrollY.value = window.scrollY
  // console.log('++++++232323++++++', scrollY.value)
  isPreview.value = true
  currentPreviewIndex.value = idx
  currentPreviewItem.value = f
  nextTick(() => {
    // console.log('++++++444333s++++++', scrollY.value)
    window.scrollTo(0, scrollY.value)
  })
}

function handleCancelPreview() {
  isPreview.value = false
  currentPreviewItem.value = undefined
  nextTick(() => {
    window.scrollTo(0, scrollY.value)
  })
}

function handleNextPreview(c: number) {
  if (currentPreviewIndex.value === undefined) return

  if (c > 0 && currentPreviewIndex.value < props.imageList.length) {
    currentPreviewIndex.value++
    currentPreviewItem.value = props.imageList[currentPreviewIndex.value].file
  } else if (c < 0 && currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--
    currentPreviewItem.value = props.imageList[currentPreviewIndex.value].file
  }
  // 切换不同照片时返回点击放大时的位置
  nextTick(() => {
    window.scrollTo(0, scrollY.value)
  })
}

function handlePreviewItemChange(item: Media, idx: number) {
  currentPreviewIndex.value = idx
}

function handleZoomIn() {
  viewerApi({
    options: {
      initialViewIndex: currentPreviewIndex.value
    },
    images: props.imageList.map(
      (image) => config.public.imageBase + image.file.url
    )
  })
}
</script>

<style scoped lang="postcss">
.left-pre {
  cursor: url('@/assets/images/pic_prev.cur'), auto;
}
.right-pre {
  cursor: url('@/assets/images/pic_next.cur'), auto;
}
.list-item-mask {
  @apply absolute left-0 top-0 h-full w-full rounded-[5px];
  &.num-mask {
    background: rgba(0, 0, 0, 0.5);
  }
}
.toolbar-container {
  @apply absolute top-0 z-20 flex items-center gap-[12px];
  .toolbar-item {
    @apply flex cursor-pointer items-center gap-[4px];
  }
}
.preview-item-control {
  @apply absolute top-0 z-10 flex h-full w-1/5 items-center justify-start;
}

.image-item-container {
  @apply relative h-0 w-full;
  padding-top: 100%;
  border-radius: 5px;
  .image-item {
    @apply absolute top-0 h-full w-full overflow-clip object-cover;
    border-radius: inherit;
  }
}

.overflow-num {
  @apply absolute left-1/2 top-1/2 break-keep text-[24px] font-semibold;
  transform: translate(-50%, -50%);
}
</style>
