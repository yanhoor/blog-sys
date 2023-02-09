<template>
  <div>
    <div v-if="loading">
      <n-card shadow="never">
        <SkeletonBlog></SkeletonBlog>
      </n-card>
    </div>

    <n-card v-else>
      <PostItem :blog="blogInfo" show-type="comment"/>
    </n-card>

    <n-back-top :right="50"/>
  </div>
</template>

<script setup lang="ts">
import { Comment, Blog } from '@/types'
import {
  NCard,
  NTime,
  NBackTop,
  createDiscreteApi
} from "naive-ui"

definePageMeta({
  // pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
  key: (route) => route.fullPath // 不然不同博客间跳转无效，在 app.vue 的 page-key
})

provide('allow_load_more_comment', true)
provide('post_item_in_detail', true)
const route = useRoute()
const loading = ref(false)
const blogInfo = ref<Blog>()
const blogId = route.params.id

useHead(() => {
  return {
    title: blogInfo.value?.content.length && blogInfo.value?.content.length > 20 ? blogInfo.value?.content.slice(0, 20) + '...' : blogInfo.value?.content || '加载中...'
  }
})

initPage()

async function initPage() {
  loading.value = true
  await getBlogInfo()
  loading.value = false
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

</script>

