<template>
  <div class="w-full">
    <div class="video-item-container w-full">
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
          class="transform-center z-10 cursor-pointer text-white"
          :component="PlayCircle24Regular"
          @click="handlePlay"
        />
        <span
          class="media-tag absolute right-0 top-0 rounded-bl-[5px] rounded-tr-[5px]"
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

<style scoped lang="postcss">
.video-item-container {
  @apply relative h-0 w-full;
  padding-top: 56.25%;
  border-radius: 5px;
  .video-item {
    @apply absolute top-0 h-full w-full cursor-pointer overflow-clip bg-black object-contain;
    border-radius: inherit;
  }
  .video-cover {
    @apply absolute top-0 h-full w-full overflow-clip object-cover;
    border-radius: inherit;
  }
}
</style>
