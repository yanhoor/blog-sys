<template>
  <div
    class="inline-flex items-center gap-[4px] align-text-bottom leading-[18px] text-[#18a058]"
    @click.stop="handlePreview"
  >
    <n-icon size="18" :component="Image24Regular" />
    <span>查看图片</span>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { Image24Regular } from '@vicons/fluent'
import { api as viewerApi } from 'v-viewer'

interface Props {
  url: string
}

const config = useRuntimeConfig()
const props = defineProps<Props>()

function handlePreview() {
  viewerApi({ images: [config.public.imageBase + props.url] })
}
</script>
