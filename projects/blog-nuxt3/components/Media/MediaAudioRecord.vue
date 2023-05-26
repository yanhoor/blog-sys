<template>
  <div class="media-audio-record flex w-full flex-col items-center gap-[12px]">
    <div class="flex items-center gap-[6px]">
      <n-icon
        v-if="recordState !== 'recording'"
        class="cursor-pointer"
        size="48"
        :component="PlayCircle24Regular"
        @click="handleStart"
      />
      <n-icon
        v-if="recordState === 'recording'"
        class="cursor-pointer"
        size="48"
        :component="PauseCircle24Regular"
        @click="handlePause"
      />
      <n-icon
        v-if="recordState !== 'inactive'"
        class="cursor-pointer"
        size="48"
        :component="RecordStop24Regular"
        @click="handleStop"
      />
    </div>
    <span v-if="recordState === 'inactive'">点击录制</span>
    <span v-else>录制时间：{{ formatDuration(recordDuration) }}</span>
    <div class="flex items-center" v-if="audioSrc">
      <span>点击播放：</span>
      <MediaAudioItem :url="audioSrc" is-absolute-url />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PauseCircle24Regular,
  PlayCircle24Regular,
  RecordStop24Regular
} from '@vicons/fluent'
import { createDiscreteApi, NIcon } from 'naive-ui'

type RecordState = 'inactive' | 'recording' | 'paused' // inactive--未开始或开始后停止

let stream: MediaStream | null,
  mediaRecorder: MediaRecorder | null,
  recordTimer: number | undefined,
  audioChunkList = []

const emits = defineEmits<{
  complete: [f: File | undefined]
}>()
const recordState = ref<RecordState>('inactive')
const recordDuration = ref(0) // 录制时长
const audioSrc = ref()
const supportMimeType = ref('') // 支持的 mime 类型
const audioExt = ref() // 文件格式

onUnmounted(() => {
  console.log('=========MediaAudioRecord unmounted==========')
  clearDurationTimer()
  closeRecordStream()
  mediaRecorder = null
  stream = null
  audioChunkList = []
})

getSupportAudioFormat()

async function initRecorder() {
  const { message } = createDiscreteApi(['message'])

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })
    console.log('=====initRecorder mimeType======', supportMimeType.value)
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: supportMimeType.value
    })

    // 在媒体开始录制时触发
    mediaRecorder.onstart = () => {
      recordState.value = mediaRecorder?.state
      audioSrc.value = undefined
      console.log('=====mediaRecorder onstart======')
    }

    // 在媒体暂停录制时触发
    mediaRecorder.onpause = () => {
      recordState.value = mediaRecorder?.state
      console.log('=====mediaRecorder onpause======')
    }

    // 暂停后回复录制视频时触发
    mediaRecorder.onresume = () => {
      recordState.value = mediaRecorder?.state
      console.log('=====mediaRecorder onresume======')
    }

    // 在媒体录制结束时、媒体流（MediaStream）结束时、或者调用 MediaRecorder.stop() 方法后触发
    mediaRecorder.onstop = () => {
      recordState.value = mediaRecorder?.state
      const blob = new Blob(audioChunkList, {
        type: supportMimeType.value
      })
      audioChunkList = []
      const file = new File(
        [blob],
        `record-audio-${new Date().getTime()}.${audioExt.value}`,
        { type: supportMimeType.value }
      )
      emits('complete', file)
      audioSrc.value = URL.createObjectURL(blob)
      console.log(
        '=====mediaRecorder onstop======',
        audioSrc.value,
        recordState.value,
        file
      )
    }

    mediaRecorder.ondataavailable = (e) => {
      console.log('=====mediaRecorder ondataavailable======', e.data)
      audioChunkList = []
      audioChunkList.push(e.data)
    }

    mediaRecorder.onerror = () => {
      recordState.value = mediaRecorder?.state
      console.log('=====mediaRecorder onerror======')
    }
  } catch (e: DOMException) {
    console.log('=====handleStartRecord======', e.name, stream, mediaRecorder)
    switch (e.name) {
      case 'NotAllowedError':
        message.error('录音权限被禁止，请先授权')
        break
      case 'NotFoundError':
        message.error('没有可用的麦克风设备')
        break
    }
  }
}

async function handleStart() {
  if (recordState.value === 'paused') {
    mediaRecorder?.resume()
    startDurationTimer()
  } else if (recordState.value === 'inactive') {
    emits('complete', undefined)
    await initRecorder()
    mediaRecorder?.start()
    startDurationTimer()
  }
}

async function handlePause() {
  mediaRecorder?.pause()
  clearDurationTimer()
  // closeRecordStream()
}

async function handleStop() {
  mediaRecorder?.stop()
  recordDuration.value = 0
  clearDurationTimer()
  closeRecordStream()
}

function closeRecordStream() {
  // 录制完要关闭，否则一直占用
  const tracks = mediaRecorder?.stream.getTracks()
  if (tracks && tracks.length) {
    tracks[0].stop()
  }
}

function startDurationTimer() {
  recordTimer = setInterval(() => {
    recordDuration.value++
  }, 1000)
}

function clearDurationTimer() {
  if (recordTimer) clearInterval(recordTimer)
}

// 获取录制音频格式
function getSupportAudioFormat() {
  const typeMap = {
    mp3: 'audio/mpeg', // mp3
    ogg: 'audio/ogg', // ogg
    webm: 'audio/webm', // webm
    mp4: 'audio/mp4' // mp4
  }

  for (const key of Object.keys(typeMap)) {
    const mime = typeMap[key]
    const isSupport = MediaRecorder.isTypeSupported(typeMap[key])
    console.log('=======getSupportAudioFormat=====', mime, isSupport)
    if (isSupport) {
      supportMimeType.value = mime
      audioExt.value = key
      break
    }
  }
}
</script>
