<template>
  <UserMainPage :uid="route.params.userId"></UserMainPage>
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.path
})
const route = useRoute()
</script>
