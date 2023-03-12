<template>
  <NotificationList type-name="系统审核" :type="4" v-slot="{ notification }">
    <!--评论-->
    <div v-if="notification.commentId">
      <div>
        您的评论审核
        <n-tag :type="notification.content.auditStatusText === '审核通过' ? 'primary' : 'error'">{{ notification.content.auditStatusText }}</n-tag>
        <span>，审核意见：{{ notification.content.auditTip || '无' }}</span>
      </div>
      <ExpandableContent :content="notification.comment.content"/>
    </div>

    <!--博客-->
    <div v-else>
      <div>
        您的博客审核
        <n-tag :type="notification.content.auditStatusText === '审核通过' ? 'primary' : 'error'">{{ notification.content.auditStatusText }}</n-tag>
        <span>，审核意见：{{ notification.content.auditTip || '无' }}</span>
      </div>
    </div>

    <div class="w-full p-[12px] cursor-pointer bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700" @click="navigateTo({ path: '/post/' + notification.blog.id })" v-if="notification.blog">
      <ExpandableContent :content="notification.blog.content"/>
    </div>
    <div class="w-full p-[12px] bg-gray-100 rounded-[5px] !border-0 dark:bg-gray-700" v-else>
      <div class="text-red-500">博客已经被删除</div>
    </div>
  </NotificationList>
</template>

<script setup lang="ts">
import {
  NTag,
} from "naive-ui"

</script>
