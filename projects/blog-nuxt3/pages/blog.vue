<template>
  <NuxtLayout>
    <template #left>
      <n-space vertical align="center">
        <div class="like-container">
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
        <div class="blog-title">{{ blogInfo.title }}</div>
        <div class="blog-info-container">
          <div class="user-info info-item">
            <UserAvatar :src="blogInfo.createBy?.avatar" size="small"></UserAvatar>
            <div>{{ blogInfo.createBy?.name }}</div>
          </div>
          <span class="info-item">发布于
        <n-time class="info-item" type="relative" :time="new Date(blogInfo.updatedAt)"></n-time>
        </span>
        </div>
        <div class="blog-content" v-html="blogInfo.content"></div>
      </n-card>

      <n-card shadow="never" class="blog-comment-container">
        <div class="comment-section" v-if="userInfo">
          <UserAvatar class="comment-user" :src="userInfo?.avatar" size="small"></UserAvatar>
          <CommentForm class="comment-form" :blogId="$route.query.id" @success="handlePageChange"/>
        </div>
        <p id="commentSection">{{ pageTotal ? `${pageTotal} 条评论` : '评论' }}</p>
        <template v-for="comment of pageList" :key="comment.id">
          <BlogCommentItem :comment="comment" ref="commentRefs"/>
        </template>
        <div class="comment-pagination-container">
          <n-pagination v-model:page="currentPage" :item-count="pageTotal" :page-size="20" :on-update:page="handlePageChange"/>
        </div>
      </n-card>
    </template>

    <n-back-top :right="100" />
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
  useMessage,
  NAvatar
} from "naive-ui"

definePageMeta({
  // pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
  key: (route) => route.query.id as string || 'blog' // 不然不同博客间跳转无效，在 app.vue 的 page-key
})

const route = useRoute()
const blogInfo = ref<Blog>()
const userInfo = useUserInfo()
const naiveMessage = useMessage()
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
    if(success){
      blogInfo.value = result
    } else if(code === 1) {
      naiveMessage.error(msg as string)
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
.like-container{
  cursor: pointer;
}
.blog-page{
  .blog-title{
    font-size: 26px;
    font-weight: 600;
  }
  .blog-info-container{
    display: flex;
    align-items: center;
    margin-top: 12px;
    .info-item{
      margin-right: 12px;
      &.user-info{
        cursor: pointer;
        display: flex;
        align-items: center;
        .n-avatar{
          margin-right: 12px;
        }
      }
    }
  }
}
.blog-comment-container{
  margin-top: 20px;
  .comment-section{
    display: flex;
    align-items: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
    .comment-user{
      margin-right: 12px;
    }
    .comment-form{
      flex: 1;
    }
  }
  .comment-pagination-container{
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
