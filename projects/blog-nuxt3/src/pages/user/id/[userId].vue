<template>
  <UserMainPage :uid="route.params.userId" />
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.path
})
const route = useRoute()
</script>
