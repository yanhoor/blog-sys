<template>
  <div class="post-detail-page">
    <div v-if="loading">
      <n-card shadow="never">
        <SkeletonBlog></SkeletonBlog>
      </n-card>
    </div>

    <n-card v-else>
      <div class="flex flex-col items-start gap-[12px]">
        <div class="relative flex w-full items-center gap-[6px]">
          <UserAvatar :user="blogInfo.createBy" :size="56" />
          <div class="flex flex-col items-start">
            <div
              class="cursor-pointer text-[20px] text-green-700"
              @click="navigateTo({ path: '/user/' + blogInfo.createBy.id })"
            >
              {{ blogInfo.createBy?.name }}
            </div>
            <span
              class="text-[12px] text-gray-500"
              v-time.format="new Date(blogInfo.createdAt)"
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

        <ExpandableContent :content="blogInfo.content" />

        <MediaListView class="w-full" :list="blogInfo.medias" />

        <div class="grid w-full grid-cols-3">
          <div
            class="flex cursor-pointer items-center justify-center gap-[6px]"
            @click="handleSwitchType('like')"
          >
            <n-icon
              class="text-green-700"
              size="18"
              :component="ThumbLike16Filled"
              @click.stop="likeBlog"
              v-if="blogInfo.isLike"
            ></n-icon>
            <n-icon
              size="18"
              :component="ThumbLike16Regular"
              @click.stop="likeBlog"
              v-else
            ></n-icon>
            <span>{{ blogInfo.likedByCount || '赞' }}</span>
          </div>
          <div
            class="flex cursor-pointer items-center justify-center gap-[6px]"
            @click="handleSwitchType('comment')"
          >
            <n-icon
              class="text-green-700"
              size="18"
              :component="CommentMultiple28Filled"
              v-if="blogInfo.commentsCount"
            ></n-icon>
            <n-icon
              size="18"
              :component="CommentMultiple16Regular"
              v-else
            ></n-icon>
            <span>{{ blogInfo.commentsCount || '评论' }}</span>
          </div>
          <div
            class="flex cursor-pointer items-center justify-center gap-[6px]"
            @click="handleSwitchType('collect')"
          >
            <n-icon
              class="text-green-700"
              size="18"
              :component="Star48Filled"
              @click.stop="collectBlog"
              v-if="blogInfo.isCollect"
            ></n-icon>
            <n-icon
              size="18"
              :component="Star48Regular"
              @click.stop="collectBlog"
              v-else
            ></n-icon>
            <span>{{ blogInfo.collectedByCount || '收藏' }}</span>
          </div>
        </div>

        <div class="w-full">
          <n-collapse-transition :show="showType === 'comment'">
            <PostCommentList
              ref="commentRef"
              class="w-full"
              allowLoadMore
              :blog="blogInfo"
              v-if="showType === 'comment'"
            />
          </n-collapse-transition>

          <n-collapse-transition :show="showType === 'like'">
            <UserList
              ref="likeRef"
              :blog-id="blogInfo.id"
              url="/blog/actionUserList/1"
              :search-params="{ blogId: blogInfo.id }"
              v-if="showType === 'like'"
            />
          </n-collapse-transition>

          <n-collapse-transition :show="showType === 'collect'">
            <UserList
              ref="collectRef"
              :blog-id="blogInfo.id"
              url="/blog/actionUserList/2"
              :search-params="{ blogId: blogInfo.id }"
              v-if="showType === 'collect'"
            />
          </n-collapse-transition>
        </div>
      </div>
    </n-card>

    <n-back-top :right="50" />
  </div>
</template>

<script setup lang="ts">
import { Blog } from 'sys-types'
import {
  NCard,
  NTime,
  NBackTop,
  NIcon,
  NDropdown,
  NButton,
  NCollapseTransition,
  DialogOptions,
  DropdownOption
} from 'naive-ui'
import {
  CommentMultiple16Regular,
  CommentMultiple28Filled,
  ThumbLike16Regular,
  ThumbLike16Filled,
  Star48Regular,
  Star48Filled,
  ChevronDown24Regular
} from '@vicons/fluent'

definePageMeta({
  // pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
  key: (route) => route.fullPath // 不然不同博客间跳转无效，在 app.vue 的 page-key
})

type ActionType = 'like' | 'comment' | 'collect' | undefined

const messageRef = ref()
const route = useRoute()
const myInfo = useUserInfo()
const loading = ref(false)
const likeLoading = ref(false)
const collectLoading = ref(false)
const blogInfo = ref<Blog>()
const blogId = route.params.id
const commentRef = ref()
const likeRef = ref()
const collectRef = ref()
const showType = ref<ActionType>('comment')
const actionOptions = shallowRef<DropdownOption[]>([])

useHead(() => {
  return {
    title:
      blogInfo.value?.content.length && blogInfo.value?.content.length > 20
        ? blogInfo.value?.content.slice(0, 20) + '...'
        : blogInfo.value?.content || '加载中...'
  }
})

await initPage()

async function initPage() {
  messageRef.value = useDiscreteApi(['message'])
  loading.value = true
  await getBlogInfo()
  loading.value = false
}

async function getBlogInfo() {
  try {
    const { result, success, msg, code } = await useFetchPost('/blog/info', {
      id: blogId
    })
    if (success) {
      blogInfo.value = result
      if (result.createById === myInfo.value?.id) {
        actionOptions.value = [
          {
            label: '删除',
            key: 'delete',
            props: {
              onClick: handleDeletePost
            }
          },
          {
            label: '复制博客地址',
            key: 'copyLink',
            props: {
              onClick: handleCopyPostUrl
            }
          }
        ]
      } else {
        actionOptions.value = [
          {
            label: '复制博客地址',
            key: 'copyLink',
            props: {
              onClick: handleCopyPostUrl
            }
          }
        ]
      }
    } else if (code === 1) {
      messageRef.value.error(msg as string)
      return navigateTo({ path: '/', replace: true })
    }
  } catch (e) {
    console.log('=====/blog/info=======', e)
  }
}

function handleCopyPostUrl() {
  navigator.clipboard
    .writeText(location.origin + '/blog/post/' + blogInfo.value?.id)
    .then((r) => {
      // console.log('-----------', r)
      messageRef.value.success('复制成功')
    })
}

async function likeBlog() {
  showType.value = 'like'
  if (!myInfo.value || likeLoading.value) {
    return messageRef.value.info('请先登录')
  }

  try {
    likeLoading.value = true
    const { result, success } = await useFetchPost('/blog/like', {
      id: blogInfo.value?.id,
      isLike: blogInfo.value?.isLike ? 0 : 1
    })
    likeLoading.value = false
    if (success) {
      getBlogInfo()
      likeRef.value?.handleLoadNextPage(1)
    }
  } catch (e) {
    likeLoading.value = false
  }
}

async function collectBlog() {
  showType.value = 'collect'
  if (!myInfo.value || collectLoading.value) {
    return messageRef.value.info('请先登录')
  }

  try {
    collectLoading.value = true
    const { result, success } = await useFetchPost('/blog/collect', {
      id: blogInfo.value?.id,
      isCollect: blogInfo.value?.isCollect ? 0 : 1
    })
    collectLoading.value = false
    if (success) {
      getBlogInfo()
    }
  } catch (e) {
    collectLoading.value = false
  }
}

function handleSwitchType(val: ActionType) {
  switch (val) {
    case 'like':
      showType.value === 'like'
        ? likeRef.value?.handleLoadNextPage(1)
        : (showType.value = val)
      break
    case 'comment':
      showType.value === 'comment'
        ? commentRef.value?.handleLoadNextPage(1)
        : (showType.value = val)
      break
    case 'collect':
      showType.value === 'collect'
        ? collectRef.value?.handleLoadNextPage(1)
        : (showType.value = val)
      break
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
          id: blogInfo.value?.id
        })
        if (success) {
          message.success('已删除')
          navigateTo('/', { replace: true })
        }
      } catch (e) {}
    },
    onNegativeClick: () => {}
  } as DialogOptions)
}
</script>
