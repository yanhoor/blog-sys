<template>
  <div class="w-full">
    <div class="w-full video-item-container">
      <video
        ref="videoRef"
        class="video-item"
        controls
        :src="config.imageBase + url"
      ></video>
      <template v-if="coverUrl && playState === PlayState.idle">
        <MediaImgView class="video-cover" :url="coverUrl" />
        <n-icon
          size="72"
          class="play-icon"
          :component="PlayCircle24Regular"
          @click="handlePlay"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { PlayCircle24Regular } from '@vicons/fluent'
import { PlayState } from 'sys-types'

interface Props {
  url: string
  coverUrl?: string
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const videoRef = ref<HTMLVideoElement>()
const playState = ref<PlayState>(PlayState.idle)

function handlePlay() {
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
  .play-icon {
    @apply cursor-pointer z-10 absolute top-1/2 left-1/2 text-white;
    transform: translate(-50%, -50%);
  }
}
</style>
