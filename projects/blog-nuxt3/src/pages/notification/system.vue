<template>
  <NotificationList v-slot="{ notification }" type-name="系统审核" :type="4">
    <!--评论-->
    <div v-if="notification.commentId">
      <div>
        您的评论审核
        <el-tag
          :type="
            notification.content.auditStatusText === '审核通过'
              ? 'primary'
              : 'error'
          "
          >{{ notification.content.auditStatusText }}</el-tag
        >
        <span>，审核意见：{{ notification.content.auditTip || '无' }}</span>
      </div>
      <ExpandableContent :content="notification.comment.content" />
    </div>

    <!--博客-->
    <div v-else>
      <div>
        您的博客审核
        <el-tag
          :type="
            notification.content.auditStatusText === '审核通过'
              ? 'primary'
              : 'error'
          "
          >{{ notification.content.auditStatusText }}</el-tag
        >
        <span>，审核意见：{{ notification.content.auditTip || '无' }}</span>
      </div>
    </div>

    <div
      v-if="notification.blog"
      class="w-full cursor-pointer rounded-[5px] !border-0 bg-gray-100 p-[12px] dark:bg-gray-700"
      @click="navigateTo({ path: '/post/' + notification.blog.id })"
    >
      <ExpandableContent
        :content="notification.blog.content"
        :topic-list="handleTopicList(notification)"
        :media-list="handleMediaList(notification)"
      />
    </div>
    <div
      v-else
      class="w-full rounded-[5px] !border-0 bg-gray-100 p-[12px] dark:bg-gray-700"
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
