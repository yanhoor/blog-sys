<template>
  <div>
    <SkeletonUser v-if="loading"/>
    <div class="flex items-start gap-8" v-else-if="userInfo">
      <div class="flex-1 overflow-hidden">
        <n-card>
          <div class="flex gap-12">
            <UserAvatar :size="120" :user="userInfo" disabled/>
            <div class="flex flex-1 flex-col gap-[6px]">
              <div class="font-bold text-3xl">{{ userInfo?.name }}</div>
              <div class="text-[14px] text-gray-400 flex items-center gap-[3px]">
                <n-time type="date" format="yyyy-MM-dd" :time="new Date(userInfo.createdAt)"></n-time>
                <span>加入</span>
              </div>
              <div class="flex items-center gap-[4px]" v-if="userInfo?.sign">
                <n-icon :component="Accessibility24Regular" size="24"></n-icon>
                <span class="font-semibold text-gray-600">{{ userInfo?.sign }}</span>
              </div>
              <div class="flex gap-[4px]" v-if="userInfo?.introduce">
                <n-icon :component="SlideText48Regular" size="24"></n-icon>
                <span>{{ userInfo?.introduce }}</span>
              </div>
            </div>
            <div class="flex items-end" v-if="myInfo?.id === userInfo.id">
              <n-button type="primary" @click="navigateTo({ name: 'user-profile' })">编辑资料</n-button>
            </div>
          </div>
        </n-card>

        <n-card class="mt-[12px]">
          <n-tabs type="line" v-model:value="contentType">
            <n-tab name="1">文章</n-tab>
            <n-tab name="2">别的东西</n-tab>
            <n-tab name="3">未想好</n-tab>
          </n-tabs>
          <BlogList :search-params="searchParams" :show-avatar="false"/>
        </n-card>
      </div>
      <div class="sticky top-[80px]">
        <n-card>
          <div class="font-semibold custom-border border-b pb-[6px] text-[16px]">个人成就</div>
          <div class="mt-[6px]">
            <div class="statis-item">
              <n-icon :component="Eye24Filled" size="24"></n-icon>
              <span>文章被阅读</span>
              <span class="statis-num">{{ statisInfo.readCount }}</span>
            </div>
            <div class="statis-item">
              <n-icon :component="ThumbLike16Filled" size="24"></n-icon>
              <span>文章被点赞</span>
              <span class="statis-num">{{ statisInfo.likeCount }}</span>
            </div>
            <div class="statis-item">
              <n-icon :component="Star48Filled" size="24"></n-icon>
              <span>文章被收藏</span>
              <span class="statis-num">{{ statisInfo.collectCount }}</span>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SlideText48Regular, Accessibility24Regular, Star48Filled, ThumbLike16Filled, Eye24Filled } from '@vicons/fluent'
import {NCard, NButton, NTabs, NTab, NTime, NIcon, createDiscreteApi} from 'naive-ui'
import {User} from "~/types"

definePageMeta({
  key: (route) => route.fullPath
})
const route = useRoute()
const myInfo = useUserInfo()
const userInfo = ref<User>()
const loading = ref(false)
const searchParams = reactive({
  uid: ''
})
const contentType = ref('1')
const statisInfo = ref({
  readCount: 0,
  likeCount: 0,
  collectCount: 0
})

useHead(() => {
  return {
    title: userInfo.value?.name || '加载中...'
  }
})

handlePageInit()

async function handlePageInit() {
  loading.value = true
  await getUserInfo()
  await getUserStatis()
  loading.value = false
}

async function getUserInfo() {
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchPost('/user/' + route.params.id, { })
    if(success){
      userInfo.value = result
      searchParams.uid = result.id
    }else{
      message.error(msg as string)
      if(code == 222){
        await navigateTo('/', { replace: true })
      }
    }
  }catch (e) {

  }
}

async function getUserStatis(){
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchPost('/statis/user', { id: userInfo.value?.id })
    if(success){
      statisInfo.value = result
    }else{
      message.error(msg as string)
    }
  }catch (e) {

  }
}

</script>

<style lang="scss" scoped>
.statis-item{
  @apply flex items-center py-[5px];
  .n-icon{
    @apply mr-[6px];
  }
  .statis-num{
    @apply ml-[6px] font-semibold text-[18px];
  }
}
</style>
