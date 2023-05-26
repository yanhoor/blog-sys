<template>
  <n-modal
    :show="show"
    class="w-[100vw]] h-[100vh]"
    @update:show="emit('update:show', false)"
  >
    <div class="relative h-full w-full bg-black pt-[calc(100%*9/16)]">
      <template v-if="isImg">
        <MediaImgView class="media-item" :url="file.url" />
      </template>
      <template v-else>
        <video
          class="media-item"
          :src="config.public.imageBase + file.url"
          controls
        ></video>
      </template>
      <n-icon
        :component="ArrowCircleLeft24Regular"
        color="#fff"
        :size="48"
        class="absolute left-[20px] top-[20px] cursor-pointer"
        @click="emit('update:show', false)"
      />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { MediaFile } from 'sys-types'
import { NCard, NModal, NIcon, createDiscreteApi } from 'naive-ui'
import { ArrowCircleLeft24Regular } from '@vicons/fluent'

interface Props {
  file: MediaFile
  isImg?: boolean
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])
const config = useRuntimeConfig()
</script>

<style lang="postcss" scoped>
.media-item {
  @apply absolute top-0 h-full w-full object-contain;
}
</style>
