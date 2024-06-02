<template>
  <span
    class="inline-flex cursor-pointer items-center gap-[4px] align-text-top leading-[18px] text-[#18a058]"
    @click.stop="handlePreview"
  >
    <Icon name="fluent:image-24-regular" size="18"></Icon>
    <span>查看图片</span>
  </span>
</template>

<script setup lang="ts">
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
