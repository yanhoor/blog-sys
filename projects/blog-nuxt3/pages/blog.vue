<template>
  <div>
    <div v-if="loading">
      <n-card shadow="never">
        <SkeletonBlog></SkeletonBlog>
      </n-card>
    </div>

    <div class="flex items-start gap-8" v-else>
      <div class="sticky top-[120px] flex flex-col items-center gap-8">
        <n-badge :value="blogInfo.likedByCount">
          <n-button circle size="large" class="w-[48px] h-[48px]" @click="likeBlog">
            <template #icon>
              <n-icon class="text-green-700" size="30" :component="ThumbLike16Filled" v-if="blogInfo.isLike"></n-icon>
              <n-icon size="30" :component="ThumbLike16Regular" v-else></n-icon>
            </template>
          </n-button>
        </n-badge>
        <n-badge :value="blogInfo.collectedByCount">
          <n-button circle size="large" class="w-[48px] h-[48px]" @click="collectBlog">
            <template #icon>
              <n-icon class="text-green-700" size="30" :component="Star48Filled" v-if="blogInfo.isCollect"></n-icon>
              <n-icon size="30" :component="Star48Regular" v-else></n-icon>
            </template>
          </n-button>
        </n-badge>
        <n-badge :value="pageTotal">
          <n-button circle size="large" class="w-[48px] h-[48px]" @click="toCommentSection">
            <template #icon>
              <n-icon class="text-green-700" size="30" :component="CommentMultiple28Filled" v-if="pageTotal"></n-icon>
              <n-icon class="text-green-700" size="30" :component="CommentMultiple16Regular" v-else></n-icon>
            </template>
          </n-button>
        </n-badge>
      </div>
      <div class="flex-1">
        <n-card shadow="never">
          <div class="text-[30px] font-semibold">{{ blogInfo.title }}</div>
          <div class="my-[12px] flex items-center gap-[12px]">
            <UserAvatar :user="blogInfo.createBy" size="large"></UserAvatar>
            <div class="flex-col gap-[6px]">
              <div class="cursor-pointer text-[20px] font-semibold" @click="navigateTo({ path: '/user/' + blogInfo.createBy.id })">{{ blogInfo.createBy?.name }}</div>
              <div class="text-gray-400 flex items-center gap-[12px]">
                <n-time type="datetime" format="yyyy-MM-dd hh:mm:ss" :time="new Date(blogInfo.updatedAt)"></n-time>
                <span>阅读 {{ blogInfo.readCount }}</span>
              </div>
            </div>
          </div>
          <div class="blog-content" v-html="blogInfo.content"></div>
        </n-card>

        <n-card shadow="never" class="mt-[20px]" id="commentSection">
          <div class="flex items-start pb-[20px]" v-if="userInfo">
            <UserAvatar class="mr-[12px]" :user="userInfo" size="small"></UserAvatar>
            <CommentForm v-if="$route.query.id" class="flex-1" :blogId="$route.query.id" :level="1" @success="fetchPage"/>
          </div>
          <template v-if="pageTotal">
            <div class="custom-border border-t pt-[12px] flex justify-between items-center">
              <div class="font-semibold">{{ pageTotal }} 条评论</div>
              <n-radio-group v-model:value="pageFetchParams.sort" @update:value="handlePageChange(1)" name="commentSort">
                <n-radio-button :value="1" label="最新"></n-radio-button>
                <n-radio-button :value="2" label="最热"></n-radio-button>
              </n-radio-group>
            </div>
            <div class="divide-y divide-border-light dark:divide-border-dark">
              <template v-for="comment of pageList" :key="comment.id">
                <CommentItem :comment="comment" :level="1" :blog="blogInfo" @commentDelete="handleCommentDelete"/>
              </template>
            </div>
            <div class="mt-[12px] flex justify-end custom-border border-t pt-[20px]">
              <n-pagination v-model:page="pageFetchParams.page" :item-count="pageTotal" :page-size="20" @update:page="handlePageChange"/>
            </div>
          </template>
        </n-card>
      </div>
    </div>

    <n-back-top :right="50"/>
  </div>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import { ThumbLike16Regular, CommentMultiple16Regular, ThumbLike16Filled, Star48Regular, Star48Filled, CommentMultiple28Filled } from '@vicons/fluent'
import {
  NButton,
  NBadge,
  NSpace,
  NIconWrapper,
  NIcon,
  NCard,
  NTime,
  NBackTop,
  NPagination,
  NRadioGroup,
  NRadioButton,
  createDiscreteApi
} from "naive-ui"

definePageMeta({
  // pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
  key: (route) => route.fullPath // 不然不同博客间跳转无效，在 app.vue 的 page-key
})

const route = useRoute()
const loading = ref(false)
const blogInfo = ref<Blog>()
const userInfo = useUserInfo()
const blogId = route.query.id
const { pageList, pageTotal, pageLoading, pageFetchParams, fetchPage, handlePageChange  } = await usePageListFetch<Comment>('/comment/list', { blogId, sort: 1 })

useHead(() => {
  return {
    title: blogInfo.value?.title || '加载中...'
  }
})

initPage()

async function initPage() {
  loading.value = true
  await getBlogInfo()
  loading.value = false
}

// onMounted(() => {
//   window.Prism?.highlightAll()
// })

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

async function likeBlog() {
  const { message } = createDiscreteApi(["message"])
  if(!userInfo.value) {
    return message.info('请先登录')
  }

  try{
    const { result, success } = await useFetchPost('/blog/like', { id: blogInfo.value?.id, isLike: blogInfo.value?.isLike ? 0 : 1 })
    if(success){
      getBlogInfo()
    }else{
      message.error('点赞失败')
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
    const { result, success } = await useFetchPost('/blog/collect', { id: blogInfo.value?.id, isCollect: blogInfo.value?.isCollect ? 0 : 1 })
    if(success){
      getBlogInfo()
    }else{
      message.error('收藏失败')
    }
  }catch (e) {

  }
}

function toCommentSection() {
  location.hash = '#commentSection'
}

function handleCommentDelete(comment: Comment) {
  const index = pageList.value.findIndex(c => c.id === comment.id)
  if(index > -1) pageList.value.splice(index, 1)
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
