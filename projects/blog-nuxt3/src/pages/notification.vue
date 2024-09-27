<template>
  <LayoutMain>
    <el-tabs
      class="sticky top-[60px] z-10 -mt-[20px] mb-[12px] bg-card-light px-[24px] dark:bg-card-dark"
      v-model="currentTab"
      @tab-change="handleChangeTab"
    >
      <el-tab-pane
        name="/notification/comment"
        :label="`评论(${unreadCommentCount})`"
      ></el-tab-pane>
      <el-tab-pane
        name="/notification/like"
        :label="`点赞(${unreadLikeCount})`"
      ></el-tab-pane>
      <el-tab-pane
        name="/notification/collect"
        :label="`收藏(${unreadCollectCount})`"
      ></el-tab-pane>
      <el-tab-pane
        name="/notification/system"
        :label="`系统审核(${unreadAuditCount})`"
      ></el-tab-pane>
    </el-tabs>
    <NuxtPage :pageKey="route.fullPath" />
  </LayoutMain>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: '/notification/comment',
  middleware: ['auth']
})

useFetchNotificationCount()
const route = useRoute()
const unreadCommentCount = useNotificationUnreadCommentCount()
const unreadLikeCount = useNotificationUnreadLikeCount()
const unreadCollectCount = useNotificationUnreadCollectCount()
const unreadAuditCount = useNotificationUnreadAuditCount()
const currentTab = ref(route.path)

watch(
  () => route.path,
  (val) => {
    currentTab.value = val
  }
)

async function handleChangeTab() {
  await navigateTo(currentTab.value)
}
</script>
