<template>
  <div class="flex flex-wrap gap-[12px]" v-bind="$attrs">
    <div class="w-full h-full relative" v-if="isPreview">
      <div class="preview-item-control left-0 left-pre" @click="handleNextPreview(-1)" v-if="currentPreviewIndex > 0">
      </div>
      <div class="w-full h-full rounded-[5px]" v-if="config.imageType.includes(getFileExt(currentPreviewItem.url))" >
        <img alt="图像" class="media-preview-item cursor-zoom-out" style="border-radius: inherit;" :src="config.imageBase + currentPreviewItem.url" @click="handleCancelPreview">
      </div>
      <video class="media-preview-item" :src="config.imageBase + currentPreviewItem.url" v-else-if="config.videoType.includes(getFileExt(currentPreviewItem.url))" controls @click.stop="handleCancelPreview"></video>
      <div class="preview-item-control right-0 right-pre" @click="handleNextPreview(1)" v-if="currentPreviewIndex !== list.length - 1">
      </div>
    </div>

    <div :class="[isPreview ? 'preview' : 'group', config.videoType.includes(getFileExt(file.url)) ? 'video-wrapper' : '', 'relative list-item-container']" v-for="(file, index) of list" :key="file.url">
      <img alt="图像" class="media-item border-solid border-green-500" :src="config.imageBase + file.url" v-if="config.imageType.includes(getFileExt(file.url))">
      <video ref="videoRef" class="media-item" controls :src="config.imageBase + file.url" v-else-if="config.videoType.includes(getFileExt(file.url))" @click.stop="handlePreview(file, index)"></video>

      <div class="list-item-mask border-2 border-green-500" v-if="isPreview && currentPreviewItem === file" @click="handlePreview(file, index)"></div>
      <div class="list-item-mask bg-gray-600 opacity-30 cursor-pointer" v-if="isPreview && currentPreviewItem !== file" @click="handlePreview(file, index)"></div>
      <template v-if="!isPreview">
        <div class="list-item-mask bg-gray-200 opacity-10 cursor-zoom-in hidden group-hover:inline-block" @click="handlePreview(file, index)" v-if="config.imageType.includes(getFileExt(file.url))">
        </div>
        <!--<n-icon :component="Play24Filled" :size="48" color="#fff" class="video-play-icon" v-else @click="handlePlayVideo(index)"/>-->
      </template>
    </div>
  </div>

  <n-modal
    v-model:show="showModal"
    class="w-[100vw]] h-[100vh]"
  >
    <div class="w-full h-full pb-9/16 relative bg-black">
      <video class="media-preview-item absolute top-0 left-0" :src="config.imageBase + currentPreviewItem.url" controls></video>
      <n-icon :component="ArrowCircleLeft24Regular" color="#fff" :size="48" class="absolute top-[20px] left-[20px] cursor-pointer" @click="showModal = false"/>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { Media } from '@/types'
import { NIcon, NModal, NCollapseTransition } from 'naive-ui'
import { ArrowCircleLeft24Regular, ArrowCircleRight24Regular, Play24Filled } from '@vicons/fluent'

interface Props{
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

function handlePreview(m: Media, idx: number) {
  const isImage = config.imageType.includes(getFileExt(m.url))
  // console.log('++++++232323++++++')
  if(isImage){
    scrollY.value = window.scrollY
    isPreview.value = true
  }else{
    if(!videoRef.value) return
    // console.log('++++++++++++', videoRef.value[idx])

    const cur = videoRef.value[idx]
    if(cur.paused) {
      cur.play()
      return
    }
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
  nextTick(() => {
    window.scrollTo(0, scrollY.value)
  })
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
  @apply w-[180px] h-[180px];
  border-radius: 5px;
  &.preview{
    @apply w-[60px] h-[60px]
  }
  &.video-wrapper{
    @apply w-full h-[480px] bg-black;
  }
}
.media-item{
  @apply w-full h-full object-cover overflow-clip;
  border-radius: inherit; // 图片圆角
}
video.media-item{
  @apply object-contain absolute top-0 left-0
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
.list-item-mask{
  @apply absolute top-0 left-0 w-full h-full rounded-[5px]
}
.preview-item-control{
  @apply absolute w-1/5 h-full top-0 flex justify-start items-center
}
.video-play-icon{
  transform: translate(-50%,-50%);
  @apply cursor-pointer absolute left-1/2 top-1/2
}
</style>
