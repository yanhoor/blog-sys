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

    <div class="blog-page" v-if="blogInfo">
      <div class="blog-title">{{ blogInfo.title }}</div>
      <div class="blog-info-container">
        <div class="user-info info-item">
          <n-avatar :src="config.imageBase + blogInfo.createBy?.avatar" size="small"></n-avatar>
          <div>{{ blogInfo.createBy?.name }}</div>
        </div>
        <span class="info-item">发布于 {{$dayjs(blogInfo.updatedAt).format('YYYY-MM-DD HH:mm')}}</span>
      </div>
      <div class="blog-content" v-html="blogInfo.content"></div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useFetchPost} from "~/composables/useBaseFetch"
import { ThumbLike16Regular, CommentMultiple16Regular } from '@vicons/fluent'
import {
  NButton,
  NSpace,
  NIconWrapper,
  NIcon,
  NAvatar
} from "naive-ui"

definePageMeta({
  pageTransition: false, // 不然 window.Prism.highlightAll() 没效果
})

const config = useRuntimeConfig()
const route = useRoute()
const blogInfo = ref()

onMounted(() => {
  window.Prism.highlightAll()
})

try{
  const { result, success } = await useFetchPost('/blog/info', { id: route.query.id })
  if(success){
    blogInfo.value = result
  }
}catch (e) {
  console.log('=====/blog/info=======', e)
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
</style>
