<template>
  <div class="relative prose prose-stone dark:prose-invert" v-html="content"></div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
}

const props = withDefaults(defineProps<Props>(), {
  // content: ""
});

</script>
