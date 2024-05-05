<template>
  <div class="flex flex-col items-start gap-[12px]">
    <div class="relative flex w-full items-center gap-[6px]">
      <UserAvatar :user="currentPost.createBy" :size="56"></UserAvatar>
      <div class="flex flex-col items-start">
        <UserName
          class="text-[18px] font-semibold"
          :user="currentPost.createBy"
        ></UserName>
        <span
          class="secondary-text-color text-[12px]"
          v-time="currentPost.createdAt"
        ></span>
      </div>
      <el-dropdown class="absolute right-0 top-0" trigger="click">
        <el-button quaternary circle type="default" class="cursor-pointer">
          <template #icon>
            <Icon name="fluent:chevron-down-20-regular"></Icon>
          </template>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handlePostCollect">{{
              currentPost.isCollect ? '取消收藏' : '收藏'
            }}</el-dropdown-item>
            <el-dropdown-item @click="handleCopyLink"
              >复制博客地址</el-dropdown-item
            >
            <el-dropdown-item
              @click="navigateTo('/post/' + currentPost.value.id)"
              >查看详情</el-dropdown-item
            >
            <el-dropdown-item
              v-if="currentPost?.createById === userInfo?.id"
              @click="handleDelete"
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div
      class="max-h-[300px] max-w-full overflow-auto"
      v-if="currentPost!.contentType == 2"
    >
      <PostArticle
        class="[&_pre]:w-fit [&_pre]:max-w-none"
        :content="currentPost!.content"
      />
    </div>
    <ExpandableContent
      v-else
      :content="currentPost!.content"
      :topicList="topicList"
      :mediaList="referenceMediaList"
    ></ExpandableContent>

    <MediaListView
      class="w-full"
      :list="currentPost.medias"
      v-if="!currentPost.referenceBlogs?.length"
    ></MediaListView>

    <PostReferenceItem
      :blog="currentPost.retweetOriginBlog"
      v-if="currentPost.retweetOriginBlog"
    ></PostReferenceItem>

    <div class="grid w-full grid-cols-3">
      <div
        class="action-item placeholder-text-color"
        :class="{ '!text-primary': showType === 'retweet' }"
        @click="handleAction('retweet')"
      >
        <Icon name="fluent:arrow-forward-20-regular" size="18"></Icon>
        <span>{{ currentPost.retweetCount || '转发' }}</span>
      </div>
      <div
        class="action-item placeholder-text-color"
        :class="{ '!text-primary': showType === 'comment' }"
        @click="handleAction('comment')"
      >
        <Icon
          name="fluent:comment-multiple-24-filled"
          class="text-primary"
          size="18"
          v-if="currentPost.commentsCount"
        ></Icon>
        <Icon name="fluent:comment-multiple-20-regular" size="18" v-else></Icon>
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

    <PostCommentList
      v-show="showType === 'comment'"
      class="w-full"
      :blog="currentPost"
      :page-size="2"
    ></PostCommentList>

    <PostRetweetList
      v-show="showType === 'retweet'"
      class="w-full"
      :blog="currentPost"
    ></PostRetweetList>
  </div>
</template>

<script setup lang="ts">
import type { Blog } from 'sys-types'
import { h } from 'vue'

interface Props {
  canEdit?: boolean // 是否能编辑文章
  blog: Blog
}

type ActionType = 'like' | 'comment' | 'retweet' | undefined

const props = defineProps<Props>()
const emit = defineEmits(['delete', 'refresh'])
const userInfo = useUserInfo()
const showType = ref<ActionType>()
const { currentPost, handlePostCollect, handlePostLike, handleDeletePost } =
  usePostActions(props.blog)

const topicList = computed(() => currentPost.value.topics?.map((t) => t.topic))
const referenceMediaList = computed(() => {
  const rl = currentPost.value.referenceBlogs?.map((b) => b.medias) || []
  return [currentPost.value.medias, ...rl].flat(2)
})

function handleAction(type: string) {
  if (showType.value === type) {
    showType.value = undefined
  } else {
    showType.value = type
  }
}

function handleCopyLink() {
  navigator.clipboard
    .writeText(location.origin + '/blog/post/' + currentPost.value.id)
    .then((r) => {
      // console.log('-----------', r)
      ElMessage.success('复制成功')
    })
}

async function handleDelete() {
  try {
    await handleDeletePost()
    emit('delete')
  } catch (e) {}
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center justify-center gap-[6px] hover:text-primary;
}
</style>
