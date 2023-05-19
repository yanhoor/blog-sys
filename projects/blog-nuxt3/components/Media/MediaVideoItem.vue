<template>
  <div class="w-full">
    <div class="w-full video-item-container">
      <video
        ref="videoRef"
        class="video-item"
        controls
        :src="config.public.imageBase + url"
      ></video>
      <template v-if="coverUrl && playState === PlayState.idle">
        <MediaImgView class="video-cover" :url="coverUrl" />
        <n-icon
          size="72"
          class="transform-center cursor-pointer z-10 text-white"
          :component="PlayCircle24Regular"
          @click="handlePlay"
        />
        <span
          class="media-tag absolute top-0 right-0 rounded-bl-[5px] rounded-tr-[5px]"
          >视频</span
        >
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { PlayCircle24Regular } from '@vicons/fluent'
import { PlayState } from 'sys-types'
import { useMediaPlayStore } from '~/store/modules/mediaPlayStore'

interface Props {
  url: string
  coverUrl?: string
}

const playStore = useMediaPlayStore()
const props = defineProps<Props>()
const config = useRuntimeConfig()
const videoRef = ref<HTMLVideoElement>()
const playState = ref<PlayState>(PlayState.idle)

function handlePlay() {
  playStore.currentRef?.pause()
  playStore.currentRef = videoRef.value
  playState.value = PlayState.playing
  videoRef.value.play()
}
</script>

<style scoped lang="scss">
.video-item-container {
  @apply relative w-full h-0;
  padding-top: 56.25%;
  border-radius: 5px;
  .video-item {
    @apply w-full h-full object-contain overflow-clip absolute top-0 cursor-pointer bg-black;
    border-radius: inherit; // 图片圆角
  }
  .video-cover {
    @apply absolute object-cover overflow-clip top-0 w-full h-full;
    border-radius: inherit;
  }
}
</style>
