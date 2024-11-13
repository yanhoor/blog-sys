<template>
  <UserMainPage :uname="route.params.userName" />
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.path
})
const route = useRoute()
</script>
