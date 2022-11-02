<template>
  <NuxtLayout>
    <template #left>
      <h3>dedwefwf</h3>
    </template>
    <div class="home-page">
      <n-button type="primary">test</n-button>
      <template v-for="blog of blogList">
        <div class="blog-container">
          <span class="blog-title" @click="toBlogDetail(blog.id)">{{ blog.title }}</span>
          <div class="blog-info-container">
            <div class="user-info info-item">
              <n-avatar round :src="config.imageBase + blog.createBy?.avatar" size="small" />
              <div>{{ blog.createBy?.name }}</div>
            </div>
            <span class="info-item">{{$dayjs(blog.updatedAt).format('YYYY-MM-DD')}}</span>
            <div class="action-container info-item">
              <n-icon size="18">
                <ThumbLike16Regular />
              </n-icon>
              <span>赞</span>
            </div>
            <div class="action-container info-item">
              <n-icon size="18">
                <CommentMultiple16Regular />
              </n-icon>
              <span>评论</span>
            </div>
          </div>
        </div>
        <!--<div v-html="blog.content"></div>-->
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { CommentMultiple16Regular, ThumbLike16Regular } from '@vicons/fluent'
import {useFetchPost} from "@/composables/useBaseFetch"
import {
  NButton,
  NIcon,
  NAvatar
} from "naive-ui"

definePageMeta({
  pageTransition: false,
})

const router = useRouter()
const config = useRuntimeConfig()
// 这样就不会使用 app.vue 里定义的 layout，而是在本页面定义的 another layout
// definePageMeta({  layout: false})
const blogList = ref([])
// const { data } = await useBaseFetch('/blog/list')
try{
  const { data, error } = await useFetchPost('/blog/list2', {})
  const source = unref(data)
  if(source.success){
    blogList.value = source.result.list
  }
}catch (e) {

}

async function toBlogDetail(id){
  await navigateTo({  path: '/blog',  query: {    id  }})
  // router.push({ path: "/blog", query: { id } })
}
</script>

<style lang="scss" scoped>
.blog-container{
  padding: 20px 0;
  border-bottom: 1px solid var(--el-border-color-light);
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
