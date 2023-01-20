<template>
  <div>
    notification index
    <NuxtPage :foobar="123" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: '/notification/comment'
})
</script>
