<template>
  <div v-if="loadError" class="flex items-center justify-center">
    <Icon name="fluent:image-off-28-regular" size="64" />
  </div>
  <NuxtImg
    v-else
    class="nuxt-image"
    :loading="lazyLoadFlag ? 'lazy' : undefined"
    :class="{ 'cursor-zoom-in': enablePreview }"
    :src="src"
    v-bind="attrs"
    @error="() => (loadError = true)"
    @click="handlePreview"
  />
</template>

<script setup lang="ts">
import defaultImg from '@/assets/images/img_error.jpeg'
import { api as viewerApi } from 'v-viewer'

interface Props {
  url: string
  ratio?: string
  width?: string | number
  height?: string | number
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
  if (props.url) {
    let res = config.public.imageBase + props.url

    // 构建OSS图片处理字符串
    const ossProcessParams = []
    if (props.width && props.height) {
      ossProcessParams.push(`resize,w_${props.width},h_${props.height}`)
    }
    ossProcessParams.push(`format,webp`)
    ossProcessParams.push(`quality,q_${props.ratio || 95}`)

    // 检查URL是否已包含查询参数
    const separator = res.includes('?') ? '&' : '?'

    // 组合处理参数与原始URL
    res = `${res}${separator}x-oss-process=image/${ossProcessParams.join('/')}`
    return res
  } else {
    return defaultImg
  }
})

function handlePreview() {
  if (props.enablePreview) {
    viewerApi({ images: [config.public.imageBase + props.url] })
  }
}
</script>
