<template>
  <NotificationList type-name="收藏" :type="3" v-slot="{ notification }">
    <div
      class="pb-[12px] whitespace-nowrap max-w-full flex items-center gap-[6px]"
    >
      <UserAvatar :user="notification.createBy" size="small" />
      <span
        class="text-green-700 font-semibold cursor-pointer text-[18px]"
        @click="navigateTo({ path: '/user/' + notification.createById })"
        >{{ notification.createBy.name }}</span
      >
      收藏了
    </div>

    <div
      class="w-full p-[12px] cursor-pointer bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700"
      @click="navigateTo({ path: '/post/' + notification.blog.id })"
      v-if="notification.blog"
    >
      <ExpandableContent :content="notification.blog.content" />
    </div>
    <div
      class="w-full p-[12px] bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700"
      v-else
    >
      <div class="text-red-500">博客已经被删除</div>
    </div>
  </NotificationList>
</template>

<script setup lang="ts">
import { NEllipsis } from 'naive-ui'
</script>
