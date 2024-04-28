<template>
  <div
      class="flex w-full flex-col items-start gap-[12px] rounded-[5px] bg-gray-100 p-[16px] dark:bg-gray-800"
  >
    <template v-if="currentPost.deletedAt">
      <p>博客已删除</p>
    </template>
    <template v-else>
      <UserName
          class="text-[14px] font-semibold"
          :user="currentPost.createBy"
          show-at
      />
      <PostArticle class="line-clamp-3" v-if="currentPost!.contentType == 2" :content="currentPost!.content"/>
      <ExpandableContent
          v-else
          :content="currentPost.content"
          :topicList="topicList"
      />

      <MediaListView class="w-full" :list="currentPost.medias"/>

      <div class="flex w-full items-center justify-between">
        <span
            class="secondary-text-color text-[12px]"
            v-time="new Date(currentPost.createdAt)"
        ></span>
        <div class="flex items-center gap-[12px]">
          <div
              class="action-item placeholder-text-color"
              @click="handleAction('retweet')"
          >
            <Icon name="fluent:arrow-forward-20-regular" size="18"></Icon>
            <span class="text-[12px]">{{
                currentPost._count.referrerBlogs || '转发'
              }}</span>
          </div>
          <div
              class="action-item placeholder-text-color"
              @click="handleAction('comment')"
          >
            <Icon name="fluent:comment-multiple-20-regular" size="18"></Icon>
            <span class="text-[12px]">{{
                currentPost._count.comments || '评论'
              }}</span>
          </div>
          <div
              class="action-item placeholder-text-color"
              @click="handleAction('like')"
          >
            <Icon name="fluent:thumb-like-20-regular" size="18"></Icon>
            <span class="text-[12px]">{{
                currentPost._count.likedBy || '赞'
              }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {Blog} from 'sys-types'

interface Props {
  blog: Blog
}

const props = defineProps<Props>()
const currentPost = ref<Blog>(props.blog)
const topicList = computed(() => currentPost.value.topics?.map((t) => t.topic))

async function handleAction(type: string) {
  await navigateTo(`/post/${currentPost.value.id}#${type}`)
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center justify-center gap-[6px] hover:text-primary;
}
</style>
