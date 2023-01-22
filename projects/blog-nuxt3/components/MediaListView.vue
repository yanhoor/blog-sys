<template>
  <div class="w-full h-full relative" v-if="isPreview">
    <div class="absolute w-1/5 h-full left-0 top-0 flex justify-start items-center group cursor-pointer left-pre" @click="handleNextPreview(-1)" v-if="currentPreviewIndex > 0">
    </div>
    <img alt="图像" class="media-preview-item cursor-zoom-out" :src="config.imageBase + currentPreviewItem.url" v-if="config.imageType.includes(getFileExt(currentPreviewItem.url))" @click="handleCancelPreview">
    <video class="media-preview-item" :src="config.imageBase + currentPreviewItem.url" v-else-if="config.videoType.includes(getFileExt(currentPreviewItem.url))" controls @click.stop="handleCancelPreview"></video>
    <div class="absolute w-1/5 h-full top-0 right-0 flex justify-end items-center group cursor-pointer right-pre" @click="handleNextPreview(1)" v-if="currentPreviewIndex !== list.length - 1">
    </div>
  </div>
  <div :class="[isPreview ? 'list-preview-item-container' : 'list-item-container rounded relative group']" v-for="(file, index) of list" :key="file.url">
    <img alt="图像" class="media-item" :src="config.imageBase + file.url" @click="handlePreview(file, index)" v-if="config.imageType.includes(getFileExt(file.url))">
    <video class="media-item" :src="config.imageBase + file.url" @click="handlePreview(file, index)" v-else-if="config.videoType.includes(getFileExt(file.url))"></video>
    <div class="absolute bg-gray-500 top-0 left-0 w-full h-full opacity-70 cursor-zoom-in hidden group-hover:inline-block" v-if="!isPreview" @click="handlePreview(file, index)"></div>
  </div>

  <n-modal
    v-model:show="showModal"
    preset="card"
    class="w-4/5 h-[100vh]"
  >
    <div class="w-full h-full pb-9/16 relative bg-black">
      <video class="media-preview-item absolute top-0 left-0" :src="config.imageBase + currentPreviewItem.url" controls></video>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { Media } from '@/types'
import { NIcon, NModal, NCollapseTransition } from 'naive-ui'
import { ArrowCircleLeft24Regular, ArrowCircleRight24Regular } from '@vicons/fluent'

interface Props{
  list: Media[]
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const isPreview = ref(false)
const showModal = ref(false)
const currentPreviewItem = ref<Media>()
const currentPreviewIndex = ref<number>()

function handlePreview(m: Media, idx: number) {
  const isImage = config.imageType.includes(getFileExt(m.url))
  if(isImage){
    isPreview.value = true
  }else{
    showModal.value = true
    isPreview.value = false
  }
  isImage ? isPreview.value = true : showModal.value = true
  currentPreviewIndex.value = idx
  currentPreviewItem.value = m
}

function handleCancelPreview() {
  isPreview.value = false
  currentPreviewItem.value = undefined
}

function getFileExt(path: string) {
  const index = path.lastIndexOf('.')
  return path.slice(index + 1).toLowerCase()
}

function handleNextPreview(c: number) {
  if(currentPreviewIndex.value === undefined) return

  if(c > 0 && currentPreviewIndex.value < props.list.length){
    currentPreviewIndex.value ++
    currentPreviewItem.value = props.list[currentPreviewIndex.value]
  }else if(c < 0 && currentPreviewIndex.value > 0){
    currentPreviewIndex.value --
    currentPreviewItem.value = props.list[currentPreviewIndex.value]
  }
}
</script>

<style scoped lang="scss">
.list-item-container{
  @apply w-[100px] h-[100px]
}
.list-preview-item-container{
  @apply w-[60px] h-[60px]
}
.media-item{
  @apply w-full h-full object-cover overflow-clip
}
.media-preview-item{
  @apply w-full h-full object-contain
}
.left-pre{
  cursor: url("@/assets/images/pic_prev.cur"), auto;
}
.right-pre{
  cursor: url("@/assets/images/pic_next.cur"), auto;
}
</style>
