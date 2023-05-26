<template>
  <div class="media-audio-item">
    <audio
      class="hidden"
      :src="audioSrc"
      ref="audioRef"
      @pause="
        () => {
          playState = PlayState.paused
        }
      "
      @ended="
        () => {
          playState = PlayState.end
        }
      "
      @durationchange="handleDurationchange"
      @timeupdate="handleTimeUpdate"
    ></audio>
    <div class="w-1/3" v-if="coverUrl">
      <div
        class="w-full h-0 relative bg-black rounded-[3px]"
        :style="{ 'padding-top': 'calc(100%*9/16)' }"
      >
        <MediaImgView class="media-cover" :url="coverUrl" v-if="coverUrl" />
        <div
          class="flex flex-col justify-center items-center gap-[5px] text-white transform-center cursor-pointer z-10"
        >
          <n-icon
            size="48"
            :component="PauseCircle24Regular"
            @click="handlePlay"
            v-if="playState === PlayState.playing"
          />
          <n-icon
            size="48"
            :component="Replay20Regular"
            @click="handlePlay"
            v-else-if="playState === PlayState.end"
          />
          <n-icon
            size="48"
            :component="PlayCircle24Regular"
            @click="handlePlay"
            v-else
          />
          <span
            >{{ currentTime > 0 ? `${formatDuration(currentTime)}/` : '' }}
            {{ formatDuration(duration) }}</span
          >
        </div>
        <span
          class="media-tag absolute top-0 right-0 rounded-bl-[3px] rounded-tr-[3px]"
          >录音</span
        >
      </div>
    </div>
    <div
      class="w-fit flex items-center px-[12px] py-[5px] dark:bg-gray-600 bg-gray-200 rounded-[6px]"
      v-else-if="duration"
    >
      <div class="flex items-center">
        <n-icon
          size="24"
          :component="PauseCircle24Regular"
          @click="handlePlay"
          v-if="playState === PlayState.playing"
        />
        <n-icon
          size="24"
          :component="Replay20Regular"
          @click="handlePlay"
          v-else-if="playState === PlayState.end"
        />
        <n-icon
          size="24"
          :component="PlayCircle24Regular"
          @click="handlePlay"
          v-else
        />
      </div>
      <div class="divide-x divide-gray-400">
        <span class="px-[8px]">{{ formatDuration(currentTime) }}</span>
        <span class="px-[8px]">{{ formatDuration(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import {
  PlayCircle24Regular,
  PauseCircle24Regular,
  Replay20Regular
} from '@vicons/fluent'
import { PlayState } from 'sys-types'
import { useMediaPlayStore } from '~/store/modules/mediaPlayStore'

interface Props {
  url: string
  isAbsoluteUrl?: boolean
  coverUrl?: string
}

const playStore = useMediaPlayStore()
const config = useRuntimeConfig()
const props = withDefaults(defineProps<Props>(), {
  isAbsoluteUrl: false
})
const audioRef = ref<HTMLAudioElement>()
const playState = ref<PlayState>(PlayState.idle)
const duration = ref(0)
const isInfinityDuration = ref(false)
const currentTime = ref(0)

const audioSrc = computed(() => {
  if (props.isAbsoluteUrl) {
    return props.url
  } else {
    return config.public.imageBase + props.url
  }
})

function handlePlay() {
  playStore.currentRef?.pause()
  playStore.currentRef = audioRef.value
  if (playState.value === PlayState.playing) {
    audioRef.value?.pause()
    playState.value = PlayState.paused
  } else {
    audioRef.value?.play()
    playState.value = PlayState.playing
  }
}

function handleDurationchange() {
  duration.value = audioRef.value?.duration || 0
  handleUnknownDuration()
  // console.log('======durationchange=====', duration.value)
}

function handleTimeUpdate() {
  if (isInfinityDuration.value) {
    audioRef.value.currentTime = 0
    isInfinityDuration.value = false
  }
  currentTime.value = audioRef.value?.currentTime || 0
}

// chrome 获取的时长可能是Infinity，需要这样处理
function handleUnknownDuration() {
  if (duration.value === Infinity || isNaN(Number(duration.value))) {
    isInfinityDuration.value = true
    audioRef.value.currentTime = 1e101 // 设置一个极大的时间，能显示后再在 handleTimeUpdate 设置回开始
  }
}
</script>

<style scoped lang="scss">
.media-cover {
  @apply absolute object-cover overflow-clip top-0 w-full h-full;
  border-radius: inherit;
}
</style>