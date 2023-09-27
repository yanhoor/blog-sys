<template>
  <div class="image-item-container">
    <MediaImgView class="image-item" :url="url" ratio="10" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  url: string
}

const props = defineProps<Props>()
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
