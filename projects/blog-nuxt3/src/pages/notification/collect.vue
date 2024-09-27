<template>
  <NotificationList type-name="收藏" :type="3" v-slot="{ notification }">
    <div
      class="flex max-w-full items-center gap-[6px] whitespace-nowrap pb-[12px]"
    >
      <UserAvatar :user="notification.createBy" :size="32" />
      <span
        class="cursor-pointer text-[18px] font-semibold text-primary"
        @click="navigateTo({ path: '/user/' + notification.createById })"
        >{{ notification.createBy.name }}</span
      >
      收藏了
    </div>

    <div
      class="w-full cursor-pointer rounded-[5px] !border-0 bg-gray-100 p-[12px] dark:bg-gray-700"
      @click="navigateTo({ path: '/post/' + notification.blog.id })"
      v-if="notification.blog"
    >
      <PostArticle
        class="line-clamp-3"
        v-if="notification.blog!.contentType == 2"
        :content="notification.blog!.content"
      />
      <ExpandableContent
        v-else
        :content="notification.blog.content"
        :topicList="handleTopicList(notification)"
        :media-list="handleMediaList(notification)"
      />
    </div>
    <div
      class="w-full rounded-[5px] !border-0 bg-gray-100 p-[12px] dark:bg-gray-700"
      v-else
    >
      <div class="text-red-500">博客已经被删除</div>
    </div>
  </NotificationList>
</template>

<script setup lang="ts">
import type { Notification } from 'sys-types'

function handleTopicList(notification: Notification) {
  return notification.blog.topics?.map((t) => t.topic)
}

function handleMediaList(notification: Notification) {
  const rl = notification.blog.referenceBlogs?.map((b) => b.medias) || []
  return [notification.blog.medias, ...rl].flat(2)
}
</script>
