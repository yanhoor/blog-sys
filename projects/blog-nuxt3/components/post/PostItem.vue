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
            v-time="new Date(currentPost.createdAt)"
        ></span>
      </div>
      <n-dropdown trigger="click" :options="actionOptions">
        <n-button
            quaternary
            circle
            type="default"
            class="absolute right-0 top-0 cursor-pointer"
        >
          <template #icon>
            <Icon name="fluent:chevron-down-20-regular"></Icon>
          </template>
        </n-button>
      </n-dropdown>
    </div>

    <PostArticle class="line-clamp-3" v-if="currentPost!.contentType == 2" :content="currentPost!.content"/>
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

    <n-collapse-transition :show="showType === 'comment'">
      <PostCommentList
          class="w-full"
          :blog="currentPost"
          :page-size="2"
      ></PostCommentList>
    </n-collapse-transition>

    <n-collapse-transition :show="showType === 'retweet'">
      <PostRetweetList class="w-full" :blog="currentPost"></PostRetweetList>
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import type {Blog} from 'sys-types'
import {NButton, NDropdown, NCollapseTransition} from 'naive-ui'
import type {DropdownOption} from 'naive-ui'
import {h} from 'vue'

interface Props {
  canEdit?: boolean // 是否能编辑文章
  blog: Blog
}

type ActionType = 'like' | 'comment' | 'retweet' | undefined

const props = defineProps<Props>()
const emit = defineEmits(['delete', 'refresh'])
const userInfo = useUserInfo()
const showType = ref<ActionType>()
const {currentPost, handlePostCollect, handlePostLike, handleDeletePost} =
    usePostActions(props.blog)

const topicList = computed(() => currentPost.value.topics?.map((t) => t.topic))
const referenceMediaList = computed(() => {
  const rl = currentPost.value.referenceBlogs?.map((b) => b.medias) || []
  return [currentPost.value.medias, ...rl].flat(2)
})
const actionOptions = computed<DropdownOption[]>(() => {
  const result: DropdownOption[] = [
    {
      label: currentPost.value.isCollect ? '取消收藏' : '收藏',
      key: 'collectBlog',
      props: {
        onClick: handlePostCollect
      }
    },
    {
      label: '复制博客地址',
      key: 'copyLink',
      props: {
        onClick: () => {
          const {message} = useDiscreteApi(['message'])
          navigator.clipboard
              .writeText(location.origin + '/blog/post/' + currentPost.value.id)
              .then((r) => {
                // console.log('-----------', r)
                message.success('复制成功')
              })
        }
      }
    },
    {
      label: '查看详情',
      key: 'viewDetail',
      props: {
        onClick: async () => {
          await navigateTo('/post/' + currentPost.value.id)
        }
      }
    }
  ]
  if (currentPost.value?.createById === userInfo.value?.id) {
    result.unshift({
      label: () =>
          h(
              'span',
              {class: 'text-red-500'},
              {
                default: () => '删除'
              }
          ),
      key: 'delete',
      props: {
        onClick: async () => {
          try {
            await handleDeletePost()
            emit('delete')
          } catch (e) {
          }
        }
      }
    })
  }

  return result
})

function handleAction(type: string) {
  if (showType.value === type) {
    showType.value = undefined
  } else {
    showType.value = type
  }
}
</script>

<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center justify-center gap-[6px] hover:text-primary;
}
</style>
