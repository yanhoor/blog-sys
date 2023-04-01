<template>
  <div class="flex flex-wrap gap-[12px]" v-bind="$attrs">
    <div class="w-full h-full relative" v-if="isPreview">
      <div
        class="preview-item-control left-0 left-pre"
        @click="handleNextPreview(-1)"
        v-if="currentPreviewIndex > 0"
      ></div>
      <div
        class="w-full h-full rounded-[5px]"
        v-if="config.imageType.includes(getFileExt(currentPreviewItem.url))"
      >
        <MediaImgView
          alt="图像"
          class="media-preview-item cursor-zoom-out"
          :url="currentPreviewItem.url"
          @click="handleCancelPreview"
        />
      </div>
      <div
        class="preview-item-control right-0 right-pre"
        @click="handleNextPreview(1)"
        v-if="currentPreviewIndex !== list.length - 1"
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
    <div
      class="w-full flex flex-wrap -mt-[6px] -ml-[6px]"
      v-else-if="imageList.length"
    >
      <div
        class="w-1/5 pt-[6px] pl-[6px] group relative cursor-zoom-in"
        v-for="(file, index) of imageList"
        :key="file.url"
        @click="handlePreview(file, index, true)"
      >
        <div class="image-item-container" v-if="index < 10">
          <MediaImgView
            alt="图像"
            class="image-item"
            :url="file.url"
            ratio="80"
          />
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

    <!--视频列表，只有一个-->
    <div class="w-full" v-else-if="videoList.length">
      <div
        class="w-full video-item-container"
        v-for="(file, index) of videoList"
        :key="file.url"
      >
        <video
          ref="videoRef"
          class="video-item"
          controls
          :src="config.imageBase + file.url"
        ></video>
      </div>
    </div>
  </div>

  <n-modal v-model:show="showModal" class="w-[100vw]] h-[100vh]">
    <div class="w-full h-full pb-9/16 relative bg-black">
      <video
        class="media-preview-item absolute top-0 left-0"
        :src="config.imageBase + currentPreviewItem.url"
        controls
      ></video>
      <n-icon
        :component="ArrowCircleLeft24Regular"
        color="#fff"
        :size="48"
        class="absolute top-[20px] left-[20px] cursor-pointer"
        @click="showModal = false"
      />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { Media } from '@/types'
import { NIcon, NModal } from 'naive-ui'
import { ArrowCircleLeft24Regular } from '@vicons/fluent'

interface Props {
  list: Media[]
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const isPreview = ref(false)
const showModal = ref(false)
const videoRef = ref<HTMLVideoElement[] | null>(null)
const currentPreviewItem = ref<Media>()
const currentPreviewIndex = ref<number>()
const scrollY = ref(0)

const videoList = computed(() =>
  props.list.filter((item) => config.videoType.includes(getFileExt(item.url)))
)
const imageList = computed(() =>
  props.list.filter((item) => config.imageType.includes(getFileExt(item.url)))
)

function handlePreview(m: Media, idx: number, record?: boolean) {
  if (record) scrollY.value = window.scrollY
  // console.log('++++++232323++++++', scrollY.value)
  isPreview.value = true
  currentPreviewIndex.value = idx
  currentPreviewItem.value = m
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

function getFileExt(path: string) {
  const index = path.lastIndexOf('.')
  return path.slice(index + 1).toLowerCase()
}

function handleNextPreview(c: number) {
  if (currentPreviewIndex.value === undefined) return

  if (c > 0 && currentPreviewIndex.value < props.list.length) {
    currentPreviewIndex.value++
    currentPreviewItem.value = props.list[currentPreviewIndex.value]
  } else if (c < 0 && currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--
    currentPreviewItem.value = props.list[currentPreviewIndex.value]
  }
  // 切换不同照片时返回点击放大时的位置
  nextTick(() => {
    window.scrollTo(0, scrollY.value)
  })
}

function handlePreviewItemChange(item: Media, idx: number) {
  currentPreviewIndex.value = idx
}
</script>

<style scoped lang="scss">
.media-preview-item {
  @apply w-full h-full object-contain;
  border-radius: inherit; // 图片圆角
}
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
.preview-item-control {
  @apply absolute w-1/5 h-full top-0 flex justify-start items-center;
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

.video-item-container {
  @apply relative w-full h-0;
  padding-top: 56.25%;
  border-radius: 5px;
  .video-item {
    @apply w-full h-full object-contain overflow-clip absolute top-0 cursor-pointer bg-black;
    border-radius: inherit; // 图片圆角
  }
}
</style>
