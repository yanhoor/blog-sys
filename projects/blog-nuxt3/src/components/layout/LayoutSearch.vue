<template>
  <y-search v-model="searchWord" @confirm="handleSearch" />
</template>

<script setup lang="ts">
const route = useRoute()
const searchWord = ref<string>((route.query?.keyword as string) || '')
const runtimeConfig = useRuntimeConfig()

async function handleSearch() {
  if (!searchWord.value?.trim()) return

  // await navigateTo({ path: '/search', query: { keyword: searchWord.value } })
  window.open(
    `${runtimeConfig.app.baseURL}search?keyword=${searchWord.value}`,
    '_blank'
  )
}
</script>
