<template>
  <div class="flex flex-col items-start gap-[12px]">
    <div class="relative flex w-full items-center gap-[6px]">
      <UserAvatar :user="currentPost!.createBy" :size="56" />
      <div class="flex flex-col items-start">
        <UserName
          class="text-[18px] font-semibold"
          :user="currentPost!.createBy"
        />
        <span
          v-time="currentPost!.createdAt"
          class="secondary-text-color text-[12px]"
        />
      </div>
      <virtual-el-popover
        width="auto"
        class="tip-0 !absolute right-0"
        trigger="hover"
      >
        <template #trigger>
          <el-button quaternary circle class="cursor-pointer">
            <template #icon>
              <Icon name="fluent:chevron-down-20-regular" />
            </template>
          </el-button>
        </template>
        <div>
          <div class="post-action-item" @click="handlePostCollect">
            {{ currentPost.isCollect ? '取消收藏' : '收藏' }}
          </div>
          <div class="post-action-item" @click="handleCopyLink">
            复制博客地址
          </div>
          <div
            class="post-action-item"
            @click="navigateTo('/post/' + currentPost.id)"
          >
            查看详情
          </div>
          <div
            v-if="currentPost?.createById === userInfo?.id"
            class="post-action-item text-red-700"
            @click="handleDelete"
          >
            删除
          </div>
        </div>
      </virtual-el-popover>
    </div>

    <div
      v-if="currentPost!.contentType == BlogContentType.richTxt"
      class="flex max-h-[300px] w-full max-w-full"
    >
      <PostArticle
        class="max-h-full w-full max-w-full overflow-hidden [&_pre]:w-full [&_pre]:max-w-full"
        :content="currentPost!.content"
        hide-more
        @see-more="navigateTo('/post/' + currentPost!.id)"
      />
    </div>
    <ExpandableContent
      v-else
      :content="currentPost!.content"
      :topic-list="topicList"
      :media-list="referenceMediaList"
    />

    <MediaListView
      v-if="!currentPost!.referenceBlogs?.length"
      class="w-full"
      :list="currentPost!.medias"
    />

    <PostReferenceItem
      v-if="currentPost.retweetOriginBlog"
      :blog="currentPost.retweetOriginBlog"
    />

    <div class="grid w-full grid-cols-3">
      <div
        class="action-item placeholder-text-color"
        :class="{ '!text-primary': showType === ActionType.retweet }"
        @click="handleAction(ActionType.retweet)"
      >
        <Icon name="fluent:arrow-forward-20-regular" size="18" />
        <span>{{ currentPost.retweetCount || '转发' }}</span>
      </div>
      <div
        class="action-item placeholder-text-color"
        :class="{ '!text-primary': showType === ActionType.comment }"
        @click="handleAction(ActionType.comment)"
      >
        <Icon
          v-if="currentPost.commentsCount"
          name="fluent:comment-multiple-24-filled"
          class="text-primary"
          size="18"
        />
        <Icon v-else name="fluent:comment-multiple-20-regular" size="18" />
        <span>{{ currentPost.commentsCount || '评论' }}</span>
      </div>
      <div class="action-item placeholder-text-color" @click="handlePostLike">
        <Icon
          v-if="currentPost.isLike"
          name="fluent:thumb-like-20-filled"
          class="text-primary"
          size="18"
        />
        <Icon v-else name="fluent:thumb-like-20-regular" size="18" />
        <span>{{ currentPost.likedByCount || '赞' }}</span>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <PostCommentList
        v-if="showType === ActionType.comment"
        class="w-full"
        :blog="currentPost!"
        :page-size="2"
      />

      <PostRetweetList
        v-else-if="showType === ActionType.retweet"
        class="w-full"
        :blog="currentPost!"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { BlogContentType, type Blog } from 'sys-types'

interface Props {
  canEdit?: boolean // 是否能编辑文章
  blog: Blog
}

enum ActionType {
  like = 'like',
  comment = 'comment',
  retweet = 'retweet'
}

const props = defineProps<Props>()
const emit = defineEmits(['delete', 'refresh'])
const userInfo = useUserInfo()
const showType = ref<ActionType>()
const { currentPost, handlePostCollect, handlePostLike, handleDeletePost } =
  usePostActions(props.blog)

const topicList = computed(() => currentPost.value.topics?.map((t) => t.topic))
const referenceMediaList = computed(() => {
  const rl = currentPost.value.referenceBlogs?.map((b: Blog) => b.medias) || []
  return [currentPost.value.medias, ...rl].flat(2)
})

function handleAction(type: ActionType) {
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
  } catch (e) {
    /* empty */
  }
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply hover:text-primary flex cursor-pointer items-center justify-center gap-[6px];
}

.post-action-item {
  @apply hover:text-primary cursor-pointer py-[4px];
}
</style>
