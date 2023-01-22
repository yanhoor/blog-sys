<template>
  <NotificationList type-name="点赞" :type="2" v-slot="{ notification }">
    <div class="pb-[12px] whitespace-nowrap max-w-full flex items-center gap-[6px]">
      <UserAvatar :user="notification.createBy" size="small"/>
      <span class="text-green-700 font-semibold cursor-pointer text-[18px]" @click="navigateTo({ path: '/user/' + notification.createById })">{{ notification.createBy.name }}</span>
      点赞了
    </div>

    <div class="w-full p-[12px] bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700">
      <n-ellipsis :line-clamp="5" :tooltip="false" class="whitespace-pre-wrap border-t-0 break-words">{{ notification.blog.content }}</n-ellipsis>
    </div>
  </NotificationList>
</template>

<script setup lang="ts">
import {
  NEllipsis,
} from "naive-ui"

function getText(str: string) {
  return str
    .replace(/<[^<>]+>/g, "")
    .replace(/&nbsp;/gi, "");
}
</script>
