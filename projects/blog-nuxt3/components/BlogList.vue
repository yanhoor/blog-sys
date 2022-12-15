<template>
  <SkeletonIndex v-if="pageLoading"></SkeletonIndex>
  <template v-else>
    <div class="divide-y divide-border-light dark:divide-border-dark">
      <div class="px-0 py-[20px]" v-for="blog of pageList">
        <div class="cursor-pointer text-[20px] truncate" @click="toBlogDetail(blog.id)">{{ blog.title }}</div>
        <div class="flex items-center mt-[20px] gap-[12px]">
          <div class="flex items-center cursor-pointer gap-[6px]">
            <UserAvatar :src="blog.createBy?.avatar" size="small" />
            <div>{{ blog.createBy?.name }}</div>
          </div>
          <n-time  type="relative" :time="new Date(blog.updatedAt)"></n-time>
          <div class="flex items-center cursor-pointer gap-[6px]" @click="likeBlog(blog)">
            <n-icon size="18" :color="blog.isLike ? 'var(--primary-color)' : null">
              <ThumbLike16Regular />
            </n-icon>
            <span>{{ blog.likedByCount ||  '赞' }}</span>
          </div>
          <div class="flex items-center cursor-pointer gap-[6px]">
            <n-icon size="18">
              <CommentMultiple16Regular />
            </n-icon>
            <span>{{ blog.commentsCount || '评论' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end border-solid border-t pt-[20px] border-border-light dark:border-border-dark">
      <n-pagination v-model:page="currentPage" :item-count="pageTotal" :page-size="20" :on-update:page="handlePageChange"/>
    </div>
  </template>
</template>

<script setup lang="ts">
import { CommentMultiple16Regular, ThumbLike16Regular } from '@vicons/fluent'
import {useFetchPost} from "@/composables/useBaseFetch"
import {
  NPagination,
  NTime,
  NIcon,
  createDiscreteApi
} from "naive-ui"
import { Blog } from '@/types'

interface Props {
  searchParams?: {
    keyword?: string
  }
}

const props = defineProps<Props>()

const router = useRouter()
const userInfo = useUserInfo()
const { currentPage, pageList, pageTotal, pageLoading, handlePageChange  } = await usePageListFetch<Blog>('/blog/list', props.searchParams)

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

async function toBlogDetail(id: number){
  await navigateTo({  path: '/blog',  query: { id }})
}
</script>

