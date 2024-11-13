<template>
  <LayoutMain>
    <NuxtPage :page-key="route.fullPath" />
  </LayoutMain>
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.path
})
const route = useRoute()
</script>
