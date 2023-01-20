<template>
  <div>
    <n-tabs class="-mt-[20px] mb-[12px] px-[24px] sticky top-[60px] z-10 bg-card-light dark:bg-card-dark" type="line" v-model:value="currentTab" @update:value="handleChangeTab">
      <n-tab name="/notification/comment">评论({{ unreadCommentCount }})</n-tab>
      <n-tab name="/notification/like">点赞({{ unreadLikeCount }})</n-tab>
      <n-tab name="/notification/collect">收藏({{ unreadCollectCount }})</n-tab>
    </n-tabs>
    <NuxtPage/>
  </div>
</template>

<script setup lang="ts">
import {
  NTabs,
  NTab
} from "naive-ui"

definePageMeta({
  redirect: '/notification/comment'
})

const route = useRoute()
const unreadCommentCount = useNotificationUnreadCommentCount()
const unreadLikeCount = useNotificationUnreadLikeCount()
const unreadCollectCount = useNotificationUnreadCollectCount()
const currentTab = ref(route.path)

watch(() => route.path, (val) => {
  currentTab.value = val
})

function handleChangeTab() {
  navigateTo(currentTab.value)
}
</script>
