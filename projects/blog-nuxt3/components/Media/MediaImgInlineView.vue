<template>
  <span
    class="inline-flex cursor-pointer items-center gap-[4px] align-text-top leading-[18px] text-[#18a058]"
    @click.stop="handlePreview"
  >
    <n-icon size="18" :component="Image24Regular" />
    <span>查看图片</span>
  </span>
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
