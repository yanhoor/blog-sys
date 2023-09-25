<template>
  <div class="post-list min-w-[720px]">
    <SkeletonPostList
      v-if="pageLoading && pageFetchParams.page === 1"
    ></SkeletonPostList>

    <div v-else>
      <div
        class="grid grid-cols-1 gap-[12px]"
        v-loadMore="handleLoadMore"
        v-auto-animate
      >
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
import { NCard, NBackTop } from 'naive-ui'
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

// todo: why? 不要放到最后，会造成通过 ref 使用这些方法时是 undefined，与下面的 await 冲突。如果去掉 await 就可以放到最后
defineExpose({
  handleLoadNextPage,
  handleChangeFetchParams
})

await handleLoadNextPage()
  .then((r) => {
    const { message } = useDiscreteApi(['message'])
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
</script>
