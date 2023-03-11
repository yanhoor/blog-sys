<template>
  <y-search v-model:value="searchWord" @confirm="handleSearch"/>
</template>

<script setup lang="ts">
const route = useRoute()
const searchWord = ref<string>(route.query?.keyword as string || '')

async function handleSearch() {
  // if(!searchWord.value?.trim()) return

  await navigateTo({ path: '/search', query: { keyword: searchWord.value } })
}
</script>
