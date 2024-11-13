<template>
  <div class="flex items-center">
    <div
      class="custom-border flex-1 border-t !border-gray-300 dark:!border-gray-700"
    />
    <p class="regular-text-color mx-[24px] my-[12px] text-center">{{ tip }}</p>
    <div
      class="custom-border flex-1 border-t !border-gray-300 dark:!border-gray-700"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  tip?: string
}

const props = withDefaults(defineProps<Props>(), {
  tip: '没有更多内容'
})
</script>
