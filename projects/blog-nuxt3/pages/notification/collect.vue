<template>
  <NotificationList type-name="收藏" :type="3" v-slot="{ notification }">
    <div class="pb-[12px] whitespace-nowrap max-w-full flex items-center gap-[6px]">
      <UserAvatar :user="notification.createBy" size="small"/>
      <span class="text-green-700 font-semibold cursor-pointer text-[18px]" @click="navigateTo({ path: '/user/' + notification.createById })">{{ notification.createBy.name }}</span>
      收藏了你的博客
    </div>

    <div class="cursor-pointer w-full pt-[12px]" @click="navigateTo({ path: '/blog', query: { id: notification.blogId } })">
      <span class="font-semibold text-[18px]">{{ notification.blog.title }}</span>
      <div class="mt-[12px]" v-html="notification.blog.content"></div>
    </div>
  </NotificationList>
</template>
