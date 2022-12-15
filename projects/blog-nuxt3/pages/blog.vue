<template>
  <NuxtLayout>
    <template #left>
      <n-space vertical align="center">
        <div class="cursor-pointer">
          <n-icon-wrapper :size="36" :border-radius="36" v-if="blogInfo?.isLike" @click="likeBlog(0)">
            <n-icon :size="28">
              <ThumbLike16Regular />
            </n-icon>
          </n-icon-wrapper>
          <n-icon :size="28" v-else @click="likeBlog(1)">
            <ThumbLike16Regular />
          </n-icon>
        </div>
        <a href="#commentSection">
          <n-icon :size="28">
            <CommentMultiple16Regular />
          </n-icon>
        </a>
      </n-space>
    </template>

    <n-card shadow="never" v-if="!blogInfo">
      <SkeletonBlog></SkeletonBlog>
    </n-card>

    <template v-else>
      <n-card shadow="never" class="blog-page">
        <div class="text-[30px] font-semibold">{{ blogInfo.title }}</div>
        <div class="my-[12px] flex items-center gap-[12px]">
          <UserAvatar :src="blogInfo.createBy?.avatar" size="large"></UserAvatar>
          <div class="flex-col gap-[6px]">
            <div class="cursor-pointer text-[20px] font-semibold">{{ blogInfo.createBy?.name }}</div>
            <div class="text-gray-400 flex items-center gap-[12px]">
              <n-time format="yyyy-MM-dd hh:mm:ss" :time="new Date(blogInfo.updatedAt)"></n-time>
              <span>阅读 {{ blogInfo.readCount }}</span>
            </div>
          </div>
        </div>
        <div class="blog-content" v-html="blogInfo.content"></div>
      </n-card>

      <n-card shadow="never" class="mt-[20px]">
        <div class="border-solid border-b border-border-light dark:border-border-dark flex items-start pb-[20px]" v-if="userInfo">
          <UserAvatar class="mr-[12px]" :src="userInfo?.avatar" size="small"></UserAvatar>
          <CommentForm v-if="$route.query.id" class="flex-1" :blogId="$route.query.id" @success="handlePageChange"/>
        </div>
        <p id="commentSection" class="mt-[12px]">{{ pageTotal ? `${pageTotal} 条评论` : '评论' }}</p>
        <div class="divide-y divide-border-light dark:divide-border-dark">
          <template v-for="comment of pageList" :key="comment.id">
            <BlogCommentItem :comment="comment" ref="commentRefs"/>
          </template>
        </div>
        <div class="mt-[12px] flex justify-end border-solid border-t pt-[20px] border-border-light dark:border-border-dark">
          <n-pagination v-model:page="currentPage" :item-count="pageTotal" :page-size="20" :on-update:page="handlePageChange"/>
        </div>
      </n-card>
    </template>

    <n-back-top :right="50"/>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import { ThumbLike16Regular, CommentMultiple16Regular } from '@vicons/fluent'
import {
  NButton,
  NSpace,
  NIconWrapper,
  NIcon,
  NCard,
  NTime,
  NBackTop,
  NPagination,
  createDiscreteApi
} from "naive-ui"

definePageMeta({
  // pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
  key: (route) => route.query.id as string || 'blog' // 不然不同博客间跳转无效，在 app.vue 的 page-key
})

const route = useRoute()
const blogInfo = ref<Blog>()
const userInfo = useUserInfo()
const blogId = route.query.id
const commentRefs = ref([])
const { currentPage, pageList, pageTotal, pageLoading, handlePageChange  } = await usePageListFetch<Comment>('/comment/list', { blogId })

const onScroll = debounce()

useHead(() => {
  return {
    title: blogInfo.value?.title || '加载中...'
  }
})

initPage()

async function initPage() {
  await getBlogInfo()
}

onMounted(() => {
  window.Prism.highlightAll()
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function debounce() {
  let timer: NodeJS.Timeout
  return function(){
    clearTimeout(timer)
    timer = setTimeout(() => {
      commentRefs.value?.forEach((node: any) => {
        const top = node.$el.getBoundingClientRect().top
        const ch = document.documentElement.clientHeight // 浏览器可见区域高度。
        node.triggerIfView(top < ch && top > 0)
      })
    }, 300)
  }
}

async function getBlogInfo(){
  try{
    const { result, success, msg, code } = await useFetchPost('/blog/info', { id: blogId })
    const { message } = createDiscreteApi(["message"])
    if(success){
      blogInfo.value = result
    } else if(code === 1) {
      message.error(msg as string)
      return navigateTo({  path: '/', replace: true })
    }
  }catch (e) {
    console.log('=====/blog/info=======', e)
  }
}

async function likeBlog(val: number) {
  if(!userInfo.value) {
    return navigateTo({  path: '/login' })
  }

  try{
    const { result, success } = await useFetchPost('/blog/like', { id: blogInfo.value.id, isLike: val })
    if(success){
      getBlogInfo()
    }
  }catch (e) {

  }
}
</script>

<style lang="scss" scoped>
.blog-content{
  :deep(img){
    max-width: 100%;
    object-fit: contain;
  }
}
</style>
