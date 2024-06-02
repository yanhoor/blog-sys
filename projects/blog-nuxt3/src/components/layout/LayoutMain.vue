<template>
  <div :class="sizeClass">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'large' | 'medium'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const sizeClass = computed(() => {
  const options = {
    large: 'xl:w-[1200px]',
    medium: 'lg:w-[960px]'
  }

  return options[props.size]
})
</script>
