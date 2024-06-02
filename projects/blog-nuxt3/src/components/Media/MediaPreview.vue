<template>
  <el-dialog
    :model-value="show"
    class="w-[100vw]] h-[100vh]"
    @close="emit('update:show', false)"
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
      <Icon
        name="fluent:arrow-circle-left-20-regular"
        color="#fff"
        size="48"
        class="absolute left-[20px] top-[20px] cursor-pointer"
        @click="emit('update:show', false)"
      ></Icon>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { MediaFile } from 'sys-types'

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
