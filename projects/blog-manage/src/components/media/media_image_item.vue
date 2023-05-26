<template>
  <img :src="imageUrl" />
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import $http, { urls, IMG_HOST } from '@/http'

interface Props {
  url: string
  quality: string | number
}

const props = defineProps<Props>()

const imageUrl = computed(() => {
  let result = IMG_HOST + props.url

  if (props.quality) result += '?x-oss-process=image/resize,p_' + props.quality

  return result
})
</script>
