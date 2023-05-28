<template>
  <div
    :style="{
      width
    }"
    class="relative pl-[6px] pt-[6px]"
  >
    <div
      class="image-item-container"
      :style="{ 'padding-top': `calc(100%*${ratio})` }"
    >
      <MediaImgView class="image-item" :url="url" ratio="80" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  width: string
  url: string
  ratio?: number
}

const props = withDefaults(defineProps<Props>(), {
  ratio: 9 / 16
})
</script>

<style lang="postcss" scoped>
.image-item-container {
  @apply relative h-0 w-full;
  border-radius: 5px;
}

.image-item {
  @apply absolute top-0 h-full w-full overflow-clip object-cover;
  border-radius: inherit;
}
</style>
