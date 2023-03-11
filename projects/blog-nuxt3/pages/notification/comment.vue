<template>
  <NotificationList type-name="评论" :type="1">
    <template #default="{ notification }">
      <div class="whitespace-nowrap max-w-full flex items-center gap-[6px]">
        <UserAvatar :user="notification.createBy" size="small"/>
        <template v-if="notification.comment.replyComment">
          <span class="text-green-700 font-semibold cursor-pointer text-[18px]" @click="navigateTo({ path: '/user/' + notification.createById })">{{ notification.createBy.name }}</span>
          回复了您的评论
          <span class="text-gray-500 px-[6px] border custom-border rounded truncate max-w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300">{{ notification.comment.replyComment.content }}</span>：
        </template>
        <template v-else>
          <span class="text-green-700 font-semibold cursor-pointer text-[18px]" @click="navigateTo({ path: '/user/' + notification.createById })">{{ notification.createBy.name }}</span>
          评论了您：
        </template>
      </div>

      <ExpandableContent class="pt-[12px] font-semibold w-full" :content="notification.comment.content" />

      <div class="w-full p-[12px] cursor-pointer bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700" @click="navigateTo({ path: '/post/' + notification.blog.id })" v-if="notification.blog">
        <ExpandableContent :content="notification.blog.content"/>
      </div>
      <div class="w-full p-[12px] bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700" v-else>
        <div class="text-red-500">博客已经被删除</div>
      </div>
    </template>
  </NotificationList>
</template>

<script setup lang="ts">
import {
  NEllipsis,
} from "naive-ui"
</script>

