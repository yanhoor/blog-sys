<template>
  <div class="flex flex-wrap gap-[12px]" v-bind="$attrs">
    <n-collapse-transition :show="isPreview">
      <div class="relative h-full w-full pt-[24px]">
        <div class="toolbar-container">
          <div class="toolbar-item" @click="() => (isPreview = false)">
            <Icon name="fluent:zoom-out-24-regular" size="20"></Icon>
            <span>收起</span>
          </div>
          <div class="toolbar-item" @click="handleZoomIn()">
            <Icon name="fluent:image-multiple-24-regular" size="20"></Icon>
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
    </n-collapse-transition>

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
      <template v-if="imageList.length < 11">
        <template v-if="imageList.length === 7">
          <div class="flex w-full flex-wrap">
            <div
              class="relative w-1/4 pl-[6px] pt-[6px]"
              v-for="(media, index) of imageList.slice(0, 4)"
              @click="handleZoomIn(index)"
              :key="media.id"
            >
              <MediaImgRatioView
                class="image-scale cursor-zoom-in pt-[calc(100%*9/16)]"
                :url="media.file.url"
              />
            </div>
          </div>

          <div class="flex w-full flex-wrap">
            <div
              class="relative w-1/3 pl-[6px] pt-[6px]"
              v-for="(media, index) of imageList.slice(4, 7)"
              @click="handleZoomIn(index + 4)"
              :key="media.id"
            >
              <MediaImgRatioView
                class="image-scale cursor-zoom-in pt-[calc(100%*9/16)]"
                :url="media.file.url"
              />
            </div>
          </div>
        </template>

        <div v-else class="flex w-full flex-wrap">
          <div
            v-for="(media, index) of imageList"
            @click="handleZoomIn(index)"
            :key="media.id"
            :style="{
              width: `calc(100% / ${getItemWidthRatio(imageList.length)}) `
            }"
            class="pl-[6px] pt-[6px]"
          >
            <MediaImgRatioView
              class="image-scale relative cursor-zoom-in"
              :class="[
                imageList.length % 5 === 0
                  ? 'pt-[100%]'
                  : 'pt-[calc(100%*9/16)]'
              ]"
              :url="media.file.url"
            />
          </div>
        </div>
      </template>

      <div
        v-else
        class="image-scale group relative w-1/5 cursor-zoom-in pl-[6px] pt-[6px]"
        v-for="(media, index) of imageList"
        :key="media.file.url"
        @click="handlePreview(media.file, index, true)"
      >
        <div class="image-item-container pt-[100%]" v-if="showAll">
          <MediaImgView class="image-item" :url="media.file.url" ratio="10" />
        </div>
        <template v-else>
          <div class="image-item-container pt-[100%]" v-if="index < 10">
            <MediaImgView class="image-item" :url="media.file.url" ratio="10" />
            <div
              class="list-item-mask bg-gray-200 group-hover:inline-block"
              :class="[index === 9 ? 'num-mask' : 'hidden opacity-10']"
            ></div>
          </div>
          <span class="overflow-num text-white" v-if="index === 9"
            >+{{ imageList.length - 10 }}</span
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Media, MediaFile } from 'sys-types'
import { NCollapseTransition } from 'naive-ui'
import { api as viewerApi } from 'v-viewer'
import MediaImgRatioView from '~/components/Media/MediaImgRatioView.vue'

interface Props {
  imageList: Media[]
  showAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAll: false
})
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

function handleZoomIn(index?: number) {
  console.log('======handleZoomIn=======', index, currentPreviewIndex.value)
  viewerApi({
    options: {
      initialViewIndex: index || currentPreviewIndex.value
    },
    images: props.imageList.map(
      (image) => config.public.imageBase + image.file.url
    )
  })
}

function getItemWidthRatio(itemCount: number): number {
  if (itemCount < 5 && itemCount % 2 === 0) return 2
  if (itemCount === 8) return 4
  if (itemCount > 5 && itemCount % 3 === 0) return 3
  if (itemCount === 10) return 5

  return itemCount
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
  border-radius: 5px;
}

.image-scale {
  @apply transition duration-300 ease-out hover:z-10 hover:scale-105;
}

.image-item {
  @apply absolute top-0 h-full w-full overflow-clip object-cover;
  border-radius: inherit;
}

.overflow-num {
  @apply absolute left-1/2 top-1/2 break-keep text-[24px] font-semibold;
  transform: translate(-50%, -50%);
}
</style>
