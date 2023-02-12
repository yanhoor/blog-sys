<template>
  <div class="flex flex-col items-start gap-[12px]">
    <div class="flex items-center gap-[6px] w-full relative">
      <UserAvatar :user="blog.createBy" :size="56"/>
      <div class="flex flex-col items-start">
        <div class="text-green-700 text-[20px] cursor-pointer" @click="navigateTo({ path: '/user/' + blog.createBy.id })">{{ blog.createBy?.name }}</div>
        <span class="text-[12px] text-gray-500" v-time="new Date(blog.updatedAt)"></span>
      </div>
      <n-dropdown trigger="click" :options="actionOptions">
        <n-button quaternary circle type="default" class="absolute top-0 right-0 cursor-pointer">
          <template #icon>
            <n-icon :component="ChevronDown24Regular"/>
          </template>
        </n-button>
      </n-dropdown>
    </div>

    <ExpandableContent :content="blog.content"/>

    <MediaListView class="w-full" :list="blog.medias"/>

    <div class="grid grid-cols-3 w-full">
      <div class="flex justify-center items-center gap-[6px]">
        <n-icon class="text-green-700 cursor-pointer" size="18" :component="ThumbLike16Filled" @click="likeBlog" v-if="blog.isLike"></n-icon>
        <n-icon class="cursor-pointer" size="18" :component="ThumbLike16Regular" @click="likeBlog" v-else></n-icon>
        <span>{{ blog.likedByCount ||  '赞' }}</span>
      </div>
      <div class="flex justify-center items-center cursor-pointer gap-[6px]" @click="showComment = !showComment">
        <n-icon class="text-green-700" size="18" :component="CommentMultiple28Filled" v-if="blog.commentsCount"></n-icon>
        <n-icon size="18" :component="CommentMultiple16Regular" v-else></n-icon>
        <span>{{ blog.commentsCount || '评论' }}</span>
      </div>
      <div class="flex justify-center items-center gap-[6px]">
        <n-icon class="text-green-700 cursor-pointer" size="18" :component="Star48Filled" @click="collectBlog" v-if="blog.isCollect"></n-icon>
        <n-icon class="cursor-pointer" size="18" :component="Star48Regular" @click="collectBlog" v-else></n-icon>
        <span>{{ blog.collectedByCount || '收藏' }}</span>
      </div>
    </div>

    <n-collapse-transition :show="showComment">
      <PostCommentList class="w-full" :blog="blog" :page-size="2" v-if="showComment"/>
    </n-collapse-transition>

  </div>
</template>

<script setup lang="ts">
import { Blog } from '@/types'
import { CommentMultiple16Regular, CommentMultiple28Filled, ThumbLike16Regular, ThumbLike16Filled, Star48Regular, Star48Filled, ChevronDown24Regular } from '@vicons/fluent'
import {
  NIcon,
  NButton,
  NDropdown,
  NTime,
  NCollapseTransition,
  createDiscreteApi
} from "naive-ui"
import type { DropdownOption } from 'naive-ui'

interface Props{
  canEdit?: boolean // 是否能编辑文章
  blog: Blog
}

const props = defineProps<Props>()
const emit = defineEmits(['delete', 'refresh'])
const userInfo = useUserInfo()
const showComment = ref(false)
const actionOptions = ref<DropdownOption[]>([
  {
    label: '复制博客地址',
    key: 'copyLink',
    props: {
      onClick: () => {
        const { message } = createDiscreteApi(["message"])
        navigator.clipboard.writeText(location.origin + '/blog/post/' + props.blog.id).then(r => {
          // console.log('-----------', r)
          message.success('复制成功')
        })
      }
    }
  }
])

if( props.blog?.createById === userInfo.value?.id){
  actionOptions.value.unshift({
    label: '删除',
    key: 'delete',
    props: {
      onClick: handleDeletePost
    }
  })
}

async function likeBlog() {
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

async function handleDeletePost() {
  const { message, dialog } = createDiscreteApi(["message", "dialog"])
  dialog.error({
    title: '删除博客',
    content: '确定删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try{
        const { result, success } = await useFetchPost('/blog/delete', { id: props.blog.id })
        if(success){
          message.success('已删除')
          emit('delete')
        }
      }catch (e) {

      }
    },
    onNegativeClick: () => {

    }
  })
}

</script>
