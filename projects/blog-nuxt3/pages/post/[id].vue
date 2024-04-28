<template>
  <LayoutMain>
    <div v-if="loading">
      <n-card shadow="never">
        <SkeletonBlog></SkeletonBlog>
      </n-card>
    </div>

    <n-card v-else>
      <div class="flex flex-col items-start gap-[12px]">
        <div class="relative flex w-full items-center gap-[6px]">
          <UserAvatar :user="currentPost.createBy" :size="56"/>
          <div class="flex flex-col items-start">
            <UserName
                class="text-[18px] font-semibold"
                :user="currentPost.createBy"
            ></UserName>
            <span
                class="text-[12px] text-gray-500"
                v-time.format="new Date(currentPost.createdAt)"
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

        <PostArticle v-if="currentPost!.contentType == 2" :content="currentPost!.content"/>
        <ExpandableContent
            v-else
            :content="currentPost.content"
            :topicList="currentPost.topics?.map((t) => t.topic)"
            :media-list="referenceMediaList"
        />

        <MediaListView
            class="w-full"
            :list="currentPost.medias"
            v-if="!currentPost.referenceBlogs.length"
        />

        <PostReferenceItem
            :blog="currentPost.retweetOriginBlog"
            v-if="currentPost.retweetOriginBlog"
        />

        <div class="grid w-full grid-cols-3">
          <div
              class="action-item placeholder-text-color"
              :class="{ '!text-primary': showType === 'retweet' }"
              @click="handleSwitchType('retweet')"
          >
            <Icon name="fluent:arrow-forward-20-regular" size="18"></Icon>
            <span>{{ currentPost.retweetCount || '转发' }}</span>
          </div>
          <div
              class="action-item placeholder-text-color"
              :class="{ '!text-primary': showType === 'comment' }"
              @click="handleSwitchType('comment')"
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
          <div
              class="action-item placeholder-text-color"
              :class="{ '!text-primary': showType === 'like' }"
              @click="handleSwitchType('like')"
          >
            <Icon
                name="fluent:thumb-like-20-filled"
                class="text-primary"
                size="18"
                @click.stop="likeBlog"
                v-if="currentPost.isLike"
            ></Icon>
            <Icon
                name="fluent:thumb-like-20-regular"
                size="18"
                @click.stop="likeBlog"
                v-else
            ></Icon>
            <span>{{ currentPost.likedByCount || '赞' }}</span>
          </div>
        </div>

        <div class="w-full">
          <n-collapse-transition :show="showType === 'comment'">
            <PostCommentList
                ref="commentRef"
                class="w-full"
                allowLoadMore
                :blog="currentPost"
            />
          </n-collapse-transition>

          <n-collapse-transition :show="showType === 'like'">
            <UserList
                ref="likeRef"
                :blog-id="currentPost.id"
                url="/blog/actionUserList/1"
                :search-params="{ blogId: currentPost.id }"
            />
          </n-collapse-transition>

          <n-collapse-transition :show="showType === 'retweet'">
            <PostRetweetList
                ref="retweetRef"
                class="w-full"
                allowLoadMore
                :blog="currentPost"
            ></PostRetweetList>
          </n-collapse-transition>
        </div>
      </div>
    </n-card>

    <n-back-top :right="50"/>
  </LayoutMain>
</template>

<script setup lang="ts">
import {
  NCard,
  NBackTop,
  NDropdown,
  NButton,
  NCollapseTransition
} from 'naive-ui'
import type {DropdownOption} from 'naive-ui'
import {h} from 'vue'

definePageMeta({
  // pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
  key: (route) => route.fullPath // 不然不同博客间跳转无效，在 app.vue 的 page-key
})

type ActionType = 'like' | 'comment' | 'retweet' | undefined

const messageRef = ref()
const route = useRoute()
const myInfo = useUserInfo()
const loading = ref(false)
const blogId = route.params.id
const commentRef = ref()
const likeRef = ref()
const retweetRef = ref()
const showType = ref<ActionType>('comment')

onMounted(() => {
  const type = location.hash.slice(1)
  showType.value = type
})
const {currentPost, handlePostCollect, handlePostLike, handleDeletePost} =
    usePostActions()

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
        onClick: collectBlog
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
  if (currentPost.value?.createById === myInfo.value?.id) {
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
            await navigateTo('/', {replace: true})
          } catch (e) {
          }
        }
      }
    })
  }

  return result
})

useHead(() => {
  return {
    title:
        currentPost.value?.content.length &&
        currentPost.value?.content.length > 20
            ? currentPost.value?.content.slice(0, 20) + '...'
            : currentPost.value?.content || '加载中...'
  }
})

initPage()

async function initPage() {
  ;({message: messageRef.value} = useDiscreteApi(['message']))
  loading.value = true
  await getBlogInfo()
  loading.value = false
}

async function getBlogInfo() {
  try {
    const {result, success, msg, code} = await useFetchPost('/blog/info', {
      id: blogId
    })
    if (success) {
      currentPost.value = result
    } else if (code === 1) {
      messageRef.value.error(msg as string)
      return navigateTo({path: '/', replace: true})
    }
  } catch (e) {
    console.log('=====/blog/info=======', e)
  }
}

function handleCopyPostUrl() {
  navigator.clipboard
      .writeText(location.origin + '/blog/post/' + currentPost.value?.id)
      .then((r) => {
        // console.log('-----------', r)
        messageRef.value.success('复制成功')
      })
}

async function likeBlog() {
  showType.value = 'like'

  try {
    await handlePostLike()
    getBlogInfo()
    likeRef.value?.handleLoadNextPage(1)
  } catch (e) {
  }
}

async function collectBlog() {
  showType.value = 'collect'

  try {
    await handlePostCollect()
    getBlogInfo()
  } catch (e) {
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
    case 'retweet':
      showType.value === 'retweet'
          ? retweetRef.value?.handleLoadNextPage(1)
          : (showType.value = val)
      break
  }
}
</script>
<style lang="postcss" scoped>
.action-item {
  @apply flex cursor-pointer items-center justify-center gap-[6px] hover:text-primary;
}
</style>
