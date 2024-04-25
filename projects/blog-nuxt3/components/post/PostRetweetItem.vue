<template>
  <div class="flex w-full flex-col items-start gap-[12px]">
    <div class="flex items-center gap-[6px]">
      <UserAvatar :user="currentPost.createBy" :size="36"></UserAvatar>
      <UserName :user="currentPost.createBy"></UserName>
    </div>
    <ExpandableContent
      :content="currentPost.content"
      :topicList="topicList"
      :mediaList="referenceMediaList"
    ></ExpandableContent>
    <div class="group flex w-full items-center justify-between">
      <span
        class="secondary-text-color text-[12px]"
        v-time="new Date(currentPost.createdAt)"
      ></span>
      <div class="flex items-center gap-[12px]">
        <span
          class="hidden cursor-pointer leading-[1] text-red-600 group-hover:inline-block"
        >
          <Icon
            name="fluent:delete-24-regular"
            size="18"
            @click="
              async () => {
                await handleDeletePost()
                emits('delete')
              }
            "
            v-if="currentPost?.createById === userInfo?.id"
          ></Icon>
        </span>
        <div
          class="action-item placeholder-text-color"
          @click="handleToPostDetail('retweet')"
        >
          <Icon name="fluent:arrow-forward-20-regular" size="18"></Icon>
          <span>{{ currentPost.retweetCount || '转发' }}</span>
        </div>
        <div
          class="action-item placeholder-text-color"
          @click="handleToPostDetail('comment')"
        >
          <Icon
            name="fluent:comment-multiple-24-filled"
            class="text-primary"
            size="18"
            v-if="currentPost.commentsCount"
          ></Icon>
          <Icon
            name="fluent:comment-multiple-20-regular"
            size="18"
            v-else
          ></Icon>
          <span>{{ currentPost.commentsCount || '评论' }}</span>
        </div>
        <div class="action-item placeholder-text-color" @click="handlePostLike">
          <Icon
            name="fluent:thumb-like-20-filled"
            class="text-primary"
            size="18"
            v-if="currentPost.isLike"
          ></Icon>
          <Icon name="fluent:thumb-like-20-regular" size="18" v-else></Icon>
          <span>{{ currentPost.likedByCount || '赞' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Blog } from 'sys-types'

interface Props {
  blog: Blog
}

const props = defineProps<Props>()
const emits = defineEmits(['delete'])
const userInfo = useUserInfo()
const { currentPost, handlePostLike, handleDeletePost } = usePostActions(
  props.blog
)

const topicList = computed(() => currentPost.value.topics?.map((t) => t.topic))
const referenceMediaList = computed(() => {
  const rl = currentPost.value.referenceBlogs?.map((b) => b.medias) || []
  return [currentPost.value.medias, ...rl].flat(2)
})

async function handleToPostDetail(type: string) {
  await navigateTo(`/post/${currentPost.value.id}#${type}`)
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center justify-center gap-[6px] text-[12px] hover:text-primary;
}
</style>
