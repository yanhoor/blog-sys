<template>
  <NuxtLayout>
    <template #left>
      <h3>dedwefwf</h3>
    </template>
    <n-card class="home-page">

      <SkeletonIndex v-if="pageLoading"></SkeletonIndex>

      <template v-else>
        <div class="blog-container" v-for="blog of blogList">
          <span class="blog-title" @click="toBlogDetail(blog.id)">{{ blog.title }}</span>
          <div class="blog-info-container">
            <div class="user-info info-item">
              <n-avatar round :src="config.imageBase + blog.createBy?.avatar" size="small" />
              <div>{{ blog.createBy?.name }}</div>
            </div>
            <n-time class="info-item" type="relative" :time="new Date(blog.updatedAt)"></n-time>
            <div class="action-container info-item" @click="likeBlog(blog)">
              <n-icon size="18" :color="blog.isLike ? 'var(--primary-color)' : null">
                <ThumbLike16Regular />
              </n-icon>
              <span>{{ blog.likedByCount ||  '赞' }}</span>
            </div>
            <div class="action-container info-item">
              <n-icon size="18">
                <CommentMultiple16Regular />
              </n-icon>
              <span>{{ blog.commentsCount || '评论' }}</span>
            </div>
          </div>
        </div>
        <!--<div v-html="blog.content"></div>-->
      </template>
    </n-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { CommentMultiple16Regular, ThumbLike16Regular } from '@vicons/fluent'
import {useFetchPost} from "@/composables/useBaseFetch"
import {
  NButton,
  NTime,
  NIcon,
  NCard,
  useMessage,
  NAvatar
} from "naive-ui"
import { Blog } from '@/types'

definePageMeta({
  pageTransition: false,
})

const router = useRouter()
const userInfo = useUserInfo()
const message = useMessage()
const config = useRuntimeConfig()
// 这样就不会使用 app.vue 里定义的 layout，而是在本页面定义的 another layout
// definePageMeta({  layout: false})
const blogList = ref([])
const pageLoading = ref(false)

getBlogList()

async function getBlogList() {
  pageLoading.value = true
  try{
    const { result, success } = await useFetchPost('/blog/list', {})
    if(success){
      blogList.value = result.list
    }
    pageLoading.value = false
  }catch (e) {
    pageLoading.value = false
  }
}

async function likeBlog(blog: Blog) {
  if(!userInfo.value) {
    return message.info('请先登录')
  }

  try{
    const { result, success } = await useFetchPost('/blog/like', { id: blog.id, isLike: blog.isLike ? 0 : 1 })
    if(success){
      blog.isLike = !blog.isLike
      blog.isLike ? blog.likedByCount ++ : blog.likedByCount --
    }
  }catch (e) {

  }
}

async function toBlogDetail(id: number){
  await navigateTo({  path: '/blog',  query: { id }})
}
</script>

<style lang="scss" scoped>
.blog-container{
  padding: 20px 0;
  &+&{
    border-top: 1px solid var(--border-color);
  }
  .blog-title{
    font-size: 20px;
    cursor: pointer;
  }
  .blog-info-container{
    display: flex;
    align-items: center;
    margin-top: 20px;
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
      &.action-container{
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--el-text-color-regular);
        .n-icon{
          margin-right: 3px;
        }
        >span{
          font-size: 14px;
        }
      }
    }
  }
}
</style>
