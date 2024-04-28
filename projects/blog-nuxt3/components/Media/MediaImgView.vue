<template>
  <div class="flex items-center justify-center" v-if="loadError">
    <Icon name="fluent:image-off-28-regular" size="64"></Icon>
  </div>
  <NuxtImg
      class="nuxt-image"
      :loading="lazyLoadFlag ? 'lazy' : undefined"
      :class="{ 'cursor-zoom-in': enablePreview }"
      :src="src"
      v-bind="attrs"
      @error="() => (loadError = true)"
      @click="handlePreview"
      v-else
  />
</template>

<script setup lang="ts">
import defaultImg from '@/assets/images/img_error.jpeg'
import {api as viewerApi} from 'v-viewer'

interface Props {
  url: string
  ratio?: string
  enablePreview?: boolean
}

const attrs = useAttrs()
const props = withDefaults(defineProps<Props>(), {
  enablePreview: false
})
const config = useRuntimeConfig()
const loadError = ref(false)
const lazyLoadFlag = useLazyLoadFlag()
const src = computed(() => {
  let res = config.public.imageBase + props.url
  if (props.ratio) {
    res += '?quality=' + props.ratio
  }
  return props.url ? res : defaultImg
})

function handlePreview() {
  if (props.enablePreview) {
    viewerApi({images: [config.public.imageBase + props.url]})
  }
}
</script>
