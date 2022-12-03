<template>
  <NuxtLayout>
    <template #left>
      <n-space vertical align="center">
        <slot name="left">
          <n-icon-wrapper :size="36" :border-radius="36" v-if="blogInfo?.isLike">
            <n-icon :size="28">
              <ThumbLike16Regular />
            </n-icon>
          </n-icon-wrapper>
          <n-icon :size="28" v-else>
            <ThumbLike16Regular />
          </n-icon>
          <n-icon :size="28">
            <CommentMultiple16Regular />
          </n-icon>
        </slot>
      </n-space>
    </template>

    <SkeletonBlog v-if="!blogInfo"></SkeletonBlog>

    <n-card shadow="never" class="blog-page" v-else>
      <div class="blog-title">{{ blogInfo.title }}</div>
      <div class="blog-info-container">
        <div class="user-info info-item">
          <n-avatar :src="config.imageBase + blogInfo.createBy?.avatar" size="small"></n-avatar>
          <div>{{ blogInfo.createBy?.name }}</div>
        </div>
        <span class="info-item">发布于
        <n-time class="info-item" type="relative" :time="new Date(blogInfo.updatedAt)"></n-time>
        </span>
      </div>
      <div class="blog-content" v-html="blogInfo.content"></div>
    </n-card>

    <n-card shadow="never" class="blog-comment-container">
      <div class="comment-section">
        <n-avatar class="comment-user" :src="config.imageBase + userInfo?.avatar" size="small" v-if="userInfo"></n-avatar>
        <CommentForm class="comment-form" :blogId="blogId" @success="getComments"/>
      </div>
      <p>{{ commentTotal ? `${commentTotal} 条评论` : '评论' }}</p>
      <template v-for="comment of commentList" :key="comment.id">
        <BlogCommentItem :comment="comment" ref="commentRefs"/>
      </template>
    </n-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Comment } from '@/types/comment'
import { ThumbLike16Regular, CommentMultiple16Regular } from '@vicons/fluent'
import {
  NButton,
  NSpace,
  NIconWrapper,
  NIcon,
  NCard,
  NTime,
  NAvatar
} from "naive-ui"

definePageMeta({
  pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
})

const config = useRuntimeConfig()
const route = useRoute()
const blogInfo = ref()
const userInfo = useUserInfo()
const commentList = ref<Comment[]>([])
const commentTotal = ref(0)
const blogId = route.query.id
const commentRefs = ref([])

const onScroll = debounce()

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

try{
  const { result, success } = await useFetchPost('/blog/info', { id: blogId })
  if(success){
    blogInfo.value = result
    getComments()
  }
}catch (e) {
  console.log('=====/blog/info=======', e)
}

async function getComments() {
  try{
    const { result, success } = await useFetchPost('/comment/list', { blogId })
    if(success){
      commentList.value = result.list
      commentTotal.value = result.total
    }
  }catch (e) {
    console.log('=====/comment/list=======', e)
  }
}
</script>

<style lang="scss" scoped>
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
}
</style>
