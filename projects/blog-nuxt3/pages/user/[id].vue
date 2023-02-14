<template>
  <div>
    <SkeletonUser v-if="loading"/>
    <div v-else-if="userInfo">
      <div class="flex-1 overflow-hidden">
        <div>
          <div class="w-full h-[180px]">
            <img :src="config.imageBase + userInfo.profileCardBg" class="w-full h-full object-cover object-center" v-if="userInfo.profileCardBg">
            <div class="w-full h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" v-else></div>
          </div>
          <div class="flex flex-col p-[12px] pt-0 gap-[12px] bg-card-light dark:bg-card-dark">
            <div class="flex items-center gap-[12px]">
              <div class="flex-1 flex gap-[12px]">
                <UserAvatar class="relative -mt-[55px]" :size="120" :user="userInfo" disabled/>
                <div class="flex flex-col gap-[6px]">
                  <div class="font-bold text-3xl">{{ userInfo?.name }}</div>
                  <div class="flex gap-[6px]">
                    <div class="flex gap-[6px] items-center cursor-pointer" @click="handleViewFriends(2)">
                      <span class="text-gray-400">粉丝</span>
                      <span class="text-[18px] font-semibold">{{ userInfo.followerCount }}</span>
                    </div>
                    <div class="flex gap-[6px] items-center cursor-pointer" @click="handleViewFriends(1)">
                      <span class="text-gray-400">关注</span>
                      <span class="text-[18px] font-semibold">{{ userInfo.followingCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-end" v-if="myInfo">
                <n-button type="primary" @click="navigateTo({ name: 'user-profile' })" v-if="myInfo?.id === userInfo.id">编辑资料</n-button>
                <UserFollowDropdown v-else :user="userInfo" @update="getUserInfo" />
              </div>
            </div>

            <div class="flex justify-between">
              <div class="flex gap-[12px]">
                <n-tag type="success" round v-if="userInfo.isMyFan">
                  <div class="flex items-center gap-[6px]">
                    <span>您的粉丝</span>
                  </div>
                </n-tag>
                <n-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>阅读数</span>
                    <span>{{ statisInfo.readCount }}</span>
                  </div>
                </n-tag>
                <n-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>点赞</span>
                    <span>{{ statisInfo.likeCount }}</span>
                  </div>
                </n-tag>
                <n-tag type="success" round>
                  <div class="flex items-center gap-[6px]">
                    <span>被收藏</span>
                    <span>{{ statisInfo.collectCount }}</span>
                  </div>
                </n-tag>
              </div>
            </div>

            <div class="flex flex-col gap-[12px] max-w-full text-gray-600">
              <div class="flex items-start gap-[6px]" v-if="userInfo?.introduce">
                <n-icon :component="DocumentText24Regular" size="20"/>
                <span>{{ userInfo?.introduce }}</span>
              </div>
              <div class="flex items-start gap-[6px]">
                <n-icon :component="CalendarLtr24Regular" size="20"/>
                <n-time type="date" format="yyyy-MM-dd" :time="new Date(userInfo.createdAt)"></n-time>
              </div>
            </div>
          </div>
        </div>

        <div class="my-[12px]">
          <n-tabs type="line" :value="contentType" @update:value="handleTabChange">
            <n-tab name="1">精选</n-tab>
            <n-tab name="2">博客</n-tab>
            <n-tab name="3">视频</n-tab>
            <n-tab name="4">图片</n-tab>
          </n-tabs>
        </div>
        <template v-if="contentType == 1">
          <PostList :search-params="{...searchParams, sort: 3}" canEdit/>
        </template>
        <template v-if="contentType == 2">
          <div class="mb-[12px]">全部博客({{ blogTotal }})</div>
          <PostList :search-params="searchParams" @fetchComplete="handleBlogFetchComplete" canEdit/>
        </template>
        <template v-if="contentType == 3">
          <UserVideoWall :user-id="userInfo.id"/>
        </template>
        <template v-if="contentType == 4">
          <UserImageWall :user-id="userInfo.id"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarLtr24Regular, DocumentText24Regular } from '@vicons/fluent'
import {NCard, NButton, NTabs, NTab, NTime, NIcon, NTag, createDiscreteApi} from 'naive-ui'
import {User, Media} from "~/types"

definePageMeta({
  key: (route) => route.path
})
const config = useRuntimeConfig()
const route = useRoute()
const myInfo = useUserInfo()
const userInfo = ref<User>()
const loading = ref(false)
const blogTotal = ref(0)
const imageList = ref<Media[]>([])
const searchParams = reactive({
  uid: ''
})
const contentType = ref(route.query.tab || '1')
const statisInfo = ref({
  readCount: 0,
  likeCount: 0,
  collectCount: 0
})

watch(() => route.query, (val) => {
  contentType.value = val.tab || '1'
})

useHead(() => {
  return {
    title: loading.value ? '加载中...' : `@${userInfo.value?.name}的个人主页`
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

function handleBlogFetchComplete(res: any) {
  blogTotal.value = res.value.total
}

function handleTabChange(val: string) {
  navigateTo('/user/' + userInfo.value?.id + '?tab=' + val)
}

function handleViewFriends(type: number) {
  if(type === 1){
    if(userInfo.value?.id === myInfo.value?.id){
      navigateTo('/my/following')
    }
  }
  if(type === 2){
    if(userInfo.value?.id === myInfo.value?.id){
      navigateTo('/my/follower')
    }
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
