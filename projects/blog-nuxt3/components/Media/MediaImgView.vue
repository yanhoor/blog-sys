<template>
  <img :src="src" />
</template>

<script setup lang="ts">
import defaultImg from '@/assets/images/img_error.jpeg'

interface Props {
  url: string
  ratio?: string
}

const props = defineProps<Props>()
const config = useRuntimeConfig()
const src = computed(() => {
  let res = config.imageBase + props.url
  if (props.ratio) res += '?x-oss-process=image/resize,p_' + props.ratio
  return props.url ? res : defaultImg
})
</script>
