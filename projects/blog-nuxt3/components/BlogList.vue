<template>
  <SkeletonIndex v-if="pageLoading"></SkeletonIndex>
  <template v-else>
    <div class="grid grid-cols-1 gap-[12px]">
      <template v-for="blog of pageList">
        <n-card>
          <div class="flex flex-col items-start gap-[12px]">
            <div class="flex items-center cursor-pointer gap-[6px]" v-if="props.showAvatar">
              <UserAvatar :user="blog.createBy" :size="56"/>
              <div class="flex flex-col items-start">
                <div class="text-green-700 text-[20px]" @click="navigateTo({ path: '/user/' + blog.createBy.id })">{{ blog.createBy?.name }}</div>
                <n-time class="text-[12px] text-gray-500" type="datetime" :time="new Date(blog.updatedAt)"></n-time>
              </div>
            </div>
            <!--<div class="whitespace-pre-wrap break-words">{{ blog.content }}</div>-->
            <n-ellipsis :line-clamp="5" :tooltip="false" class="whitespace-pre-wrap break-words">{{ blog.content }}</n-ellipsis>
            <div class="flex flex-wrap gap-[12px] w-full">
              <MediaListView :list="blog.medias"/>
            </div>
            <div class="grid grid-cols-3 w-full">
              <div class="flex justify-center items-center cursor-pointer gap-[6px]" @click="likeBlog(blog)">
                <n-icon class="text-green-700" size="18" :component="ThumbLike16Filled" v-if="blog.isLike"></n-icon>
                <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
                <span>{{ blog.likedByCount ||  '赞' }}</span>
              </div>
              <div class="flex justify-center items-center cursor-pointer gap-[6px]">
                <n-icon class="text-green-700" size="18" :component="CommentMultiple28Filled" v-if="blog.commentsCount"></n-icon>
                <n-icon size="18" :component="CommentMultiple16Regular" v-else></n-icon>
                <span>{{ blog.commentsCount || '评论' }}</span>
              </div>
              <div class="flex justify-center items-center cursor-pointer gap-[6px]" @click="collectBlog(blog)">
                <n-icon class="text-green-700" size="18" :component="Star48Filled" v-if="blog.isCollect"></n-icon>
                <n-icon size="18" :component="Star48Regular" v-else></n-icon>
                <span>{{ blog.collectedByCount || '收藏' }}</span>
              </div>
            </div>
          </div>
        </n-card>
      </template>
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
  NCard,
  NEllipsis,
  NCollapse,
  NCollapseItem,
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

const fetchNewPost = useFetchNewPost()
const route = useRoute()
const userInfo = useUserInfo()
const { pageList, pageTotal, pageLoading, pageFetchParams, handlePageChange  } = await usePageListFetch<Blog>('/blog/list', props.searchParams)

watch(fetchNewPost, (val) => {
  if(val && route.fullPath === '/'){
    pageList.value.unshift(val as Blog)
  }
})

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

