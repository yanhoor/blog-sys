<template>
  <div class="flex items-center">
    <div class="custom-border border-t flex-1 !border-gray-300 dark:!border-gray-700"></div>
    <p class="text-center my-[12px] mx-[24px]">{{ tip }}</p>
    <div class="custom-border border-t flex-1 !border-gray-300 dark:!border-gray-700"></div>
  </div>
</template>

<script setup lang="ts">
interface Props{
  tip?: string
}

const props = withDefaults(defineProps<Props>(), {
  tip: '没有更多内容'
})
</script>
