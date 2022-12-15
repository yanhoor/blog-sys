<template>
  <n-input placeholder="搜索关键字" v-model:value="searchWord" clearable @keyup.enter="handleSearch">
    <template #prefix>
      <n-icon class="cursor-pointer" :component="Search12Regular" @click="handleSearch"/>
    </template>
  </n-input>
</template>

<script setup lang="ts">
import {
  NInput,
  NIcon,
} from "naive-ui"
import { Search12Regular } from '@vicons/fluent'

const route = useRoute()
const searchWord = ref<string>(route.query?.keyword as string)

async function handleSearch() {
  // if(!searchWord.value?.trim()) return

  await navigateTo({ path: '/search', query: { keyword: searchWord.value } })
}
</script>
