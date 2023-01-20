<template>
  <SkeletonIndex v-if="pageLoading"></SkeletonIndex>
  <template v-else>
    <div class="divide-y divide-border-light dark:divide-border-dark">
      <div class="px-0 py-[20px] group" v-for="blog of pageList">
        <div class="cursor-pointer text-[20px] truncate" @click="toBlogDetail(blog.id)">{{ blog.title }}</div>
        <div class="flex justify-between items-center mt-[20px]">
          <div class="flex items-center justify-between gap-[12px]">
            <div class="flex items-center cursor-pointer gap-[6px]" v-if="props.showAvatar">
              <UserAvatar :user="blog.createBy" size="small"/>
              <div class="text-green-700" @click="navigateTo({ path: '/user/' + blog.createBy.id })">{{ blog.createBy?.name }}</div>
            </div>
            <n-time  type="date" :time="new Date(blog.updatedAt)"></n-time>
            <div class="flex items-center cursor-pointer gap-[6px]" @click="likeBlog(blog)">
              <n-icon class="text-green-700" size="18" :component="ThumbLike16Filled" v-if="blog.isLike"></n-icon>
              <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
              <span>{{ blog.likedByCount ||  '赞' }}</span>
            </div>
            <div class="flex items-center cursor-pointer gap-[6px]">
              <n-icon class="text-green-700" size="18" :component="CommentMultiple28Filled" v-if="blog.commentsCount"></n-icon>
              <n-icon size="18" :component="CommentMultiple16Regular" v-else></n-icon>
              <span>{{ blog.commentsCount || '评论' }}</span>
            </div>
            <div class="flex items-center cursor-pointer gap-[6px]" @click="collectBlog(blog)">
              <n-icon class="text-green-700" size="18" :component="Star48Filled" v-if="blog.isCollect"></n-icon>
              <n-icon size="18" :component="Star48Regular" v-else></n-icon>
              <span>{{ blog.collectedByCount || '收藏' }}</span>
            </div>
          </div>
          <n-button class="hidden group-hover:inline-block" text type="primary" v-if="canEdit && blog.createById === userInfo.id" @click="navigateTo({ path: '/writeBlog', query: { id: blog.id } })">编辑</n-button>
        </div>
      </div>
    </div>
    <div class="flex justify-end custom-border border-t pt-[20px]">
      <n-pagination v-model:page="pageFetchParams.page" :item-count="pageTotal" :page-size="20" @update:page="handlePageChange"/>
    </div>
  </template>
</template>

<script setup lang="ts">
import { CommentMultiple16Regular, CommentMultiple28Filled, ThumbLike16Regular, ThumbLike16Filled, Star48Regular, Star48Filled } from '@vicons/fluent'
import {useFetchPost} from "@/composables/useBaseFetch"
import {
  NPagination,
  NTime,
  NIcon,
  NButton,
  createDiscreteApi
} from "naive-ui"
import { Blog } from '@/types'

interface Props {
  showAvatar?: boolean
  canEdit?: boolean // 是否能编辑文章
  searchParams?: {
    keyword?: string
    time?: string
    sort?: string
    uid?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true
})

const router = useRouter()
const userInfo = useUserInfo()
const { pageList, pageTotal, pageLoading, pageFetchParams, handlePageChange  } = await usePageListFetch<Blog>('/blog/list', props.searchParams)

async function likeBlog(blog: Blog) {
  const { message } = createDiscreteApi(["message"])
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

async function collectBlog(blog: Blog) {
  const { message } = createDiscreteApi(["message"])
  if(!userInfo.value) {
    return message.info('请先登录')
  }

  try{
    const { result, success } = await useFetchPost('/blog/collect', { id: blog.id, isCollect: blog.isCollect ? 0 : 1 })
    if(success){
      blog.isCollect = !blog.isCollect
      blog.isCollect ? blog.collectedByCount ++ : blog.collectedByCount --
    }
  }catch (e) {

  }
}

async function toBlogDetail(id: number){
  await navigateTo({  path: '/blog',  query: { id }})
}
</script>

