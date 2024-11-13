<template>
  <LayoutMain>
    <el-tabs
      v-model="currentTab"
      class="bg-card-light dark:bg-card-dark sticky top-[60px] z-10 -mt-[20px] mb-[12px] px-[24px]"
      @tab-change="handleChangeTab"
    >
      <el-tab-pane
        name="/notification/comment"
        :label="`评论(${unreadCommentCount})`"
      />
      <el-tab-pane
        name="/notification/like"
        :label="`点赞(${unreadLikeCount})`"
      />
      <el-tab-pane
        name="/notification/collect"
        :label="`收藏(${unreadCollectCount})`"
      />
      <el-tab-pane
        name="/notification/system"
        :label="`系统审核(${unreadAuditCount})`"
      />
    </el-tabs>
    <NuxtPage :page-key="route.fullPath" />
  </LayoutMain>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: '/notification/comment',
  middleware: ['auth']
})

const { handleFetchNotificationCount } = useFetchNotificationCount()
const route = useRoute()
const unreadCommentCount = useNotificationUnreadCommentCount()
const unreadLikeCount = useNotificationUnreadLikeCount()
const unreadCollectCount = useNotificationUnreadCollectCount()
const unreadAuditCount = useNotificationUnreadAuditCount()
const currentTab = ref(route.path)
handleFetchNotificationCount()

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
