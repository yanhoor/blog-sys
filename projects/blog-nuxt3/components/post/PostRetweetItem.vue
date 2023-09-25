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
        <n-icon
          class="hidden cursor-pointer text-red-600 group-hover:inline-block"
          :component="Delete24Regular"
          size="18"
          @click="
            async () => {
              await handleDeletePost()
              emits('delete')
            }
          "
          v-if="currentPost?.createById === userInfo?.id"
        />
        <div
          class="action-item placeholder-text-color"
          @click="handleToPostDetail('retweet')"
        >
          <n-icon size="18" :component="ArrowForward16Regular"></n-icon>
          <span>{{ currentPost.retweetCount || '转发' }}</span>
        </div>
        <div
          class="action-item placeholder-text-color"
          @click="handleToPostDetail('comment')"
        >
          <n-icon
            class="text-primary"
            size="18"
            :component="CommentMultiple28Filled"
            v-if="currentPost.commentsCount"
          ></n-icon>
          <n-icon
            size="18"
            :component="CommentMultiple16Regular"
            v-else
          ></n-icon>
          <span>{{ currentPost.commentsCount || '评论' }}</span>
        </div>
        <div class="action-item placeholder-text-color" @click="handlePostLike">
          <n-icon
            class="text-primary"
            size="18"
            :component="ThumbLike16Filled"
            v-if="currentPost.isLike"
          ></n-icon>
          <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
          <span>{{ currentPost.likedByCount || '赞' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowForward16Regular,
  CommentMultiple16Regular,
  CommentMultiple28Filled,
  ThumbLike16Filled,
  Delete24Regular,
  ThumbLike16Regular
} from '@vicons/fluent'
import { NIcon } from 'naive-ui'
import { Blog } from 'sys-types'

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

function handleToPostDetail(type: string) {
  navigateTo(`/post/${currentPost.value.id}#${type}`)
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center justify-center gap-[6px] text-[12px] hover:text-primary;
}
</style>
