<template>
  <div class="mx-auto flex w-1/2 items-center">
    <div
      class="custom-border flex-1 border-t !border-gray-300 dark:!border-gray-700"
    />
    <p
      class="regular-text-color mx-[24px] my-[12px] whitespace-nowrap text-center"
    >
      {{ tip }}
    </p>
    <div
      class="custom-border flex-1 border-t !border-gray-300 dark:!border-gray-700"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  tip?: string
}

withDefaults(defineProps<Props>(), {
  tip: '没有更多内容'
})
</script>
