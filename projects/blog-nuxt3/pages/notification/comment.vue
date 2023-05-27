<template>
  <NotificationList type-name="评论" :type="1">
    <template #default="{ notification }">
      <div class="flex max-w-full items-center gap-[6px] whitespace-nowrap">
        <UserAvatar :user="notification.createBy" size="small" />
        <template v-if="notification.comment.replyComment">
          <span
            class="cursor-pointer text-[18px] font-semibold text-green-700"
            @click="navigateTo({ path: '/user/' + notification.createById })"
            >{{ notification.createBy.name }}</span
          >
          回复了您的评论
          <div
            class="custom-border flex max-w-full items-center gap-[4px] truncate rounded border bg-gray-200 px-[6px] text-gray-500 dark:bg-gray-600 dark:text-gray-300"
          >
            <ExpandableContent
              :max-length="80"
              :content="notification.comment.replyComment.content"
              :img-url="notification.comment.replyComment.image?.url"
            />
          </div>
          ：
        </template>
        <template v-else>
          <span
            class="cursor-pointer text-[18px] font-semibold text-green-700"
            @click="navigateTo({ path: '/user/' + notification.createById })"
            >{{ notification.createBy.name }}</span
          >
          评论了您：
        </template>
      </div>

      <ExpandableContent
        class="w-full pt-[12px] font-semibold"
        :content="
          notification.comment.content ||
          (notification.comment.replyComment ? '图片回复' : '图片评论')
        "
      />

      <MediaImgView
        :url="notification.comment.image.url"
        v-if="notification.comment.image"
        enablePreview
        class="max-h-[135px] max-w-[180px] object-contain"
      />

      <div
        class="w-full cursor-pointer rounded-[5px] !border-0 bg-gray-100 p-[12px] dark:bg-gray-700"
        @click="navigateTo({ path: '/post/' + notification.blog.id })"
        v-if="notification.blog"
      >
        <ExpandableContent :content="notification.blog.content" />
      </div>
      <div
        class="w-full rounded-[5px] !border-0 bg-gray-100 p-[12px] dark:bg-gray-700"
        v-else
      >
        <div class="text-red-500">博客已经被删除</div>
      </div>
    </template>
  </NotificationList>
</template>

<script setup lang="ts">
import { NEllipsis } from 'naive-ui'
</script>
