<template>
  <div class="media-list-view" v-if="list.length">
    <div v-if="!mediaType"></div>
    <MediaImageList v-else-if="mediaType === 'image'" :image-list="list" />
    <MediaVideoItem
      v-else-if="mediaType === 'video'"
      :url="list[0].file.url"
      :cover-url="list[0].cover?.url"
    />
    <MediaAudioItem
      v-else-if="mediaType === 'audio'"
      :url="list[0].file.url"
      :cover-url="list[0].cover?.url"
    />
    <div v-else>未知媒体类型</div>
  </div>
</template>

<script setup lang="ts">
import { Media } from 'sys-types'

interface Props {
  list: Media[]
}

const props = defineProps<Props>()

const mediaType = computed(() => props.list[0]?.file.type)
</script>
