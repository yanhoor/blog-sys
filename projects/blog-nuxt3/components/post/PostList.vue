<template>
  <div class="post-list">
    <SkeletonPostList
      v-if="pageLoading && pageFetchParams.page === 1"
    ></SkeletonPostList>

    <div v-else>
      <div class="grid grid-cols-1 gap-[12px]" v-loadMore="handleLoadMore">
        <template v-for="(blog, index) of pageList" :key="blog.id">
          <n-card>
            <PostItem
              :blog="blog"
              v-bind="$attrs"
              @delete="handlePostDelete(index)"
            />
          </n-card>
        </template>
      </div>
      <ResultLoading v-if="pageLoading" />
      <ResultError v-else-if="!fetchResult" @refresh="handleLoadNextPage(1)" />
      <ResultEmpty
        v-else-if="pageList.length === 0"
        @refresh="handleLoadNextPage(1)"
      />
      <ResultNoMore v-else-if="pageLoadedFinish" />
      <n-back-top :right="50" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NBackTop, createDiscreteApi } from 'naive-ui'
import { Blog } from 'sys-types'

interface Props {
  searchParams?: {
    keyword?: string
    time?: string
    startTime?: string
    endTime?: string
    sort?: string
    uid?: string
    gid?: string
    [k: string]: any
  }
  url?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '/blog/list'
})
const emit = defineEmits(['fetchComplete'])
const fetchNewPost = useFetchNewPost()
const route = useRoute()
const userInfo = useUserInfo()
const {
  pageFetchParams,
  pageList,
  pageLoading,
  fetchResult,
  pageLoadedFinish,
  handleLoadNextPage,
  handleChangeFetchParams
} = useListAppendFetch<Blog>(props.url, props.searchParams, {})

await handleLoadNextPage()
  .then((r) => {
    const { message } = createDiscreteApi(['message'])
    if (r?.success) {
      emit('fetchComplete', fetchResult)
    } else {
      message.error(r?.msg || '请求出错')
    }
  })
  .catch((e) => {
    console.log('-------', e.message)
  })

watch(fetchNewPost, (val) => {
  if (val && route.fullPath === '/') {
    pageList.value.unshift(val as Blog)
  }
})

function handleLoadMore() {
  // console.log('----------handleLoadMore-----------')
  handleLoadNextPage()
  return pageLoadedFinish.value
}

function handlePostDelete(idx: number) {
  pageList.value.splice(idx, 1)
}

defineExpose({
  handleLoadNextPage,
  handleChangeFetchParams
})
</script>
