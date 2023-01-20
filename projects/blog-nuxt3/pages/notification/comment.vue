<template>
  <NotificationList type-name="评论" :type="1">
    <template #default="{ notification }">
      <div class="pb-[12px] whitespace-nowrap max-w-full flex items-center gap-[6px]">
        <UserAvatar :user="notification.createBy" size="small"/>
        <template v-if="notification.comment.replyComment">
          <span class="text-green-700 font-semibold cursor-pointer text-[18px]" @click="navigateTo({ path: '/user/' + notification.createById })">{{ notification.createBy.name }}</span>
          回复了你在博客
          <span class="text-green-700">⟪</span>
          <span class="font-semibold text-green-700 cursor-pointer truncate shrink" @click="navigateTo({ path: '/blog', query: { id: notification.blogId } })">{{ notification.blog.title }}</span>
          <span class="text-green-700">⟫</span>
          的评论：
        </template>
        <template v-else>
          <span class="text-green-700 font-semibold cursor-pointer text-[18px]" @click="navigateTo({ path: '/user/' + notification.createById })">{{ notification.createBy.name }}</span>
          评论了您的博客
          <span class="text-green-700">⟪</span>
          <span class="font-semibold text-green-700 cursor-pointer truncate" @click="navigateTo({ path: '/blog', query: { id: notification.blogId } })">{{ notification.blog.title }}</span>
          <span class="text-green-700">⟫</span>:
        </template>
      </div>

      <div class="pt-[12px] font-semibold w-full">{{ notification.comment.content }}</div>

      <div class="text-gray-500 mt-[6px] py-[3px] px-[6px] border custom-border rounded truncate max-w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300" v-if="notification.comment.replyComment">{{ notification.comment.replyComment.content }}</div>
    </template>
  </NotificationList>
</template>

