<template>
  <div class="flex flex-wrap gap-[12px]" v-bind="$attrs">
    <div class="w-full h-full pt-[24px] relative" v-if="isPreview">
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
        class="preview-item-control left-0 left-pre"
        @click="handleNextPreview(-1)"
        v-if="currentPreviewIndex > 0"
      ></div>
      <div class="w-full h-0 pt-[100%] relative rounded-[5px]">
        <MediaImgView
          class="absolute top-0 w-full h-full cursor-zoom-out radius-inherit object-cover"
          :url="currentPreviewItem.url"
          @click="handleCancelPreview"
        />
      </div>
      <div
        class="preview-item-control right-0 right-pre"
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
    <div class="w-full flex flex-wrap -mt-[6px] -ml-[6px]" v-else>
      <div
        class="w-1/5 pt-[6px] pl-[6px] group relative cursor-zoom-in"
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

<style scoped lang="scss">
.left-pre {
  cursor: url('@/assets/images/pic_prev.cur'), auto;
}
.right-pre {
  cursor: url('@/assets/images/pic_next.cur'), auto;
}
.list-item-mask {
  @apply absolute top-0 left-0 w-full h-full rounded-[5px];
  &.num-mask {
    background: rgba(0, 0, 0, 0.5);
  }
}
.toolbar-container {
  @apply z-20 flex items-center absolute top-0 gap-[12px];
  .toolbar-item {
    @apply flex items-center gap-[4px] cursor-pointer;
  }
}
.preview-item-control {
  @apply z-10 absolute w-1/5 h-full top-0 flex justify-start items-center;
}

.image-item-container {
  @apply relative w-full h-0;
  padding-top: 100%;
  border-radius: 5px;
  .image-item {
    @apply w-full h-full object-cover overflow-clip absolute top-0;
    border-radius: inherit; // 图片圆角
  }
}

.overflow-num {
  @apply absolute top-1/2 left-1/2 font-semibold text-[24px] break-keep;
  transform: translate(-50%, -50%);
}
</style>