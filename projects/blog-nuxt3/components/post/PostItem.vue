<template>
  <div class="flex flex-col items-start gap-[12px]">
    <div class="flex items-center gap-[6px]">
      <UserAvatar :user="blog.createBy" :size="56"/>
      <div class="flex flex-col items-start">
        <div class="text-green-700 text-[20px] cursor-pointer" @click="navigateTo({ path: '/user/' + blog.createBy.id })">{{ blog.createBy?.name }}</div>
        <n-time class="text-[12px] text-gray-500" type="datetime" :time="new Date(blog.updatedAt)"></n-time>
      </div>
    </div>

    <ExpandableContent :content="blog.content"/>

    <MediaListView class="w-full" :list="blog.medias"/>
    <div class="grid grid-cols-3 w-full">
      <div class="flex justify-center items-center cursor-pointer gap-[6px]" @click="handleSwitchType('like')">
        <n-icon class="text-green-700" size="18" :component="ThumbLike16Filled" v-if="blog.isLike"></n-icon>
        <n-icon size="18" :component="ThumbLike16Regular" v-else></n-icon>
        <span>{{ blog.likedByCount ||  '赞' }}</span>
      </div>
      <div class="flex justify-center items-center cursor-pointer gap-[6px]" @click="handleSwitchType('comment')">
        <n-icon class="text-green-700" size="18" :component="CommentMultiple28Filled" v-if="blog.commentsCount"></n-icon>
        <n-icon size="18" :component="CommentMultiple16Regular" v-else></n-icon>
        <span>{{ blog.commentsCount || '评论' }}</span>
      </div>
      <div class="flex justify-center items-center cursor-pointer gap-[6px]" @click="handleSwitchType('collect')">
        <n-icon class="text-green-700" size="18" :component="Star48Filled" v-if="blog.isCollect"></n-icon>
        <n-icon size="18" :component="Star48Regular" v-else></n-icon>
        <span>{{ blog.collectedByCount || '收藏' }}</span>
      </div>
    </div>

    <n-collapse-transition :show="showType === 'comment'">
      <PostCommentList ref="commentRef" class="w-full" :blog="blog" :page-size="commentPageSize" v-if="showType === 'comment'"/>
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { Blog } from '@/types'
import { CommentMultiple16Regular, CommentMultiple28Filled, ThumbLike16Regular, ThumbLike16Filled, Star48Regular, Star48Filled } from '@vicons/fluent'
import {
  NTime,
  NIcon,
  NEllipsis,
  NButton,
  NCollapseTransition,
  createDiscreteApi
} from "naive-ui"
import ExpandableContent from "~/components/ExpandableContent.vue";

interface Props{
  blog: Blog
  showType?: ActionType
  commentPageSize?: number
}

type ActionType = 'like' | 'comment' | 'collect' | undefined

const props = defineProps<Props>()
const showType = ref<ActionType>(props.showType)
const userInfo = useUserInfo()
const commentRef = ref()

async function likeBlog() {
  showType.value = 'like'
  const { message } = createDiscreteApi(["message"])
  if(!userInfo.value) {
    return message.info('请先登录')
  }

  try{
    const { result, success } = await useFetchPost('/blog/like', { id: props.blog.id, isLike: props.blog.isLike ? 0 : 1 })
    if(success){
      props.blog.isLike = !props.blog.isLike
      props.blog.isLike ? props.blog.likedByCount ++ : props.blog.likedByCount --
    }
  }catch (e) {

  }
}

async function collectBlog() {
  showType.value = 'collect'
  const { message } = createDiscreteApi(["message"])
  if(!userInfo.value) {
    return message.info('请先登录')
  }

  try{
    const { result, success } = await useFetchPost('/blog/collect', { id: props.blog.id, isCollect: props.blog.isCollect ? 0 : 1 })
    if(success){
      props.blog.isCollect = !props.blog.isCollect
      props.blog.isCollect ? props.blog.collectedByCount ++ : props.blog.collectedByCount --
    }
  }catch (e) {

  }
}

function handleSwitchType(val: ActionType) {
  showType.value = val
  switch (val) {
    case 'like':
      likeBlog()
      break
    case 'comment':
      if(props.blog.commentsCount) commentRef.value?.handlePageChange(1)
      break
    case 'collect':
      collectBlog()
      break
  }
}

</script>
