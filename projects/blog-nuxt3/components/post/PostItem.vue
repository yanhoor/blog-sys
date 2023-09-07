<template>
  <div class="flex flex-col items-start gap-[12px]">
    <div class="relative flex w-full items-center gap-[6px]">
      <UserAvatar :user="currentPost.createBy" :size="56" />
      <div class="flex flex-col items-start">
        <div
          class="cursor-pointer text-[20px] text-green-700"
          @click="navigateTo({ path: '/user/' + currentPost.createBy.id })"
        >
          {{ currentPost.createBy?.name }}
        </div>
        <span
          class="text-[12px] text-gray-500"
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
            <n-icon :component="ChevronDown24Regular" />
          </template>
        </n-button>
      </n-dropdown>
    </div>

    <ExpandableContent :content="currentPost.content" :topic="topicList" />

    <MediaListView class="w-full" :list="currentPost.medias" />

    <div class="grid w-full grid-cols-3">
      <div
        class="flex cursor-pointer items-center justify-center gap-[6px]"
        @click="likeBlog"
      >
        <n-icon
          class="text-green-700"
          size="18"
          :component="ThumbLike16Filled"
          v-if="currentPost.isLike"
        ></n-icon>
        <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
        <span>{{ currentPost.likedByCount || '赞' }}</span>
      </div>
      <div
        class="flex cursor-pointer items-center justify-center gap-[6px]"
        @click="showComment = !showComment"
      >
        <n-icon
          class="text-green-700"
          size="18"
          :component="CommentMultiple28Filled"
          v-if="currentPost.commentsCount"
        ></n-icon>
        <n-icon size="18" :component="CommentMultiple16Regular" v-else></n-icon>
        <span>{{ currentPost.commentsCount || '评论' }}</span>
      </div>
      <div
        class="flex cursor-pointer items-center justify-center gap-[6px]"
        @click="collectBlog"
      >
        <n-icon
          class="text-green-700"
          size="18"
          :component="Star48Filled"
          v-if="currentPost.isCollect"
        ></n-icon>
        <n-icon size="18" :component="Star48Regular" v-else></n-icon>
        <span>{{ currentPost.collectedByCount || '收藏' }}</span>
      </div>
    </div>

    <n-collapse-transition :show="showComment">
      <PostCommentList
        class="w-full"
        :blog="currentPost"
        :page-size="2"
        v-if="showComment"
      />
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { Blog } from 'sys-types'
import {
  CommentMultiple16Regular,
  CommentMultiple28Filled,
  ThumbLike16Regular,
  ThumbLike16Filled,
  Star48Regular,
  Star48Filled,
  ChevronDown24Regular
} from '@vicons/fluent'
import {
  NIcon,
  NButton,
  NDropdown,
  NCollapseTransition,
  DialogOptions
} from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { h } from 'vue'

interface Props {
  canEdit?: boolean // 是否能编辑文章
  blog: Blog
}

const props = defineProps<Props>()
const emit = defineEmits(['delete', 'refresh'])
const userInfo = useUserInfo()
const showComment = ref(false)
const likeLoading = ref(false)
const collectLoading = ref(false)
const currentPost = ref<Blog>(props.blog)
const actionOptions = ref<DropdownOption[]>([
  {
    label: '复制博客地址',
    key: 'copyLink',
    props: {
      onClick: () => {
        const { message } = useDiscreteApi(['message'])
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
      onClick: () => {
        navigateTo('/post/' + currentPost.value.id)
      }
    }
  }
])
const topicList = computed(() => currentPost.value.topics?.map((t) => t.topic))

if (currentPost.value?.createById === userInfo.value?.id) {
  actionOptions.value.unshift({
    label: () =>
      h(
        'span',
        { class: 'text-red-500' },
        {
          default: () => '删除'
        }
      ),
    key: 'delete',
    props: {
      onClick: handleDeletePost
    }
  })
}

async function likeBlog() {
  const { message } = useDiscreteApi(['message'])
  if (!userInfo.value || likeLoading.value) {
    return message.info('请先登录')
  }

  try {
    likeLoading.value = true
    const { result, success } = await useFetchPost('/blog/like', {
      id: currentPost.value.id,
      isLike: currentPost.value.isLike ? 0 : 1
    })
    likeLoading.value = false
    if (success) {
      currentPost.value.isLike = !currentPost.value.isLike
      currentPost.value.isLike
        ? currentPost.value.likedByCount++
        : currentPost.value.likedByCount--
    }
  } catch (e) {
    likeLoading.value = false
  }
}

async function collectBlog() {
  const { message } = useDiscreteApi(['message'])
  if (!userInfo.value || collectLoading.value) {
    return message.info('请先登录')
  }

  try {
    collectLoading.value = true
    const { result, success } = await useFetchPost('/blog/collect', {
      id: currentPost.value.id,
      isCollect: currentPost.value.isCollect ? 0 : 1
    })
    collectLoading.value = false
    if (success) {
      currentPost.value.isCollect = !currentPost.value.isCollect
      currentPost.value.isCollect
        ? currentPost.value.collectedByCount++
        : currentPost.value.collectedByCount--
    }
  } catch (e) {
    collectLoading.value = false
  }
}

async function handleDeletePost() {
  const { message, dialog } = useDiscreteApi(['message', 'dialog'])
  dialog.error({
    title: '删除博客',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const { result, success } = await useFetchPost('/blog/delete', {
          id: currentPost.value.id
        })
        if (success) {
          message.success('已删除')
          emit('delete')
        }
      } catch (e) {}
    },
    onNegativeClick: () => {}
  } as DialogOptions)
}
</script>
