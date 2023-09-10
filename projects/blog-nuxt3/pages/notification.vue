<template>
  <LayoutMain>
    <n-tabs
      class="sticky top-[60px] z-10 -mt-[20px] mb-[12px] bg-card-light px-[24px] dark:bg-card-dark"
      type="line"
      v-model:value="currentTab"
      @update:value="handleChangeTab"
    >
      <n-tab name="/notification/comment">评论({{ unreadCommentCount }})</n-tab>
      <n-tab name="/notification/like">点赞({{ unreadLikeCount }})</n-tab>
      <n-tab name="/notification/collect">收藏({{ unreadCollectCount }})</n-tab>
      <n-tab name="/notification/system"
        >系统审核({{ unreadAuditCount }})</n-tab
      >
    </n-tabs>
    <NuxtPage :pageKey="route.fullPath" />
  </LayoutMain>
</template>

<script setup lang="ts">
import { NTabs, NTab, createDiscreteApi } from 'naive-ui'
import { useNotificationUnreadAuditCount } from '~/composables/useNotification'

definePageMeta({
  redirect: '/notification/comment',
  middleware: async (to, from) => {
    const { message } = useDiscreteApi(['message'])
    const token = useCookie('token')
    // console.log('=============', token, to.fullPath, from.fullPath)
    if (!token.value) {
      message.error('请先登录')
      return navigateTo({ path: '/', replace: true })
    }
  }
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

function handleChangeTab() {
  navigateTo(currentTab.value)
}
</script>
