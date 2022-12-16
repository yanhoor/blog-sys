<template>
  <NuxtLayout>
    <SkeletonUser v-if="loading"/>
    <template v-else>
      <n-card>
        <div class="flex gap-12">
          <UserAvatar :size="120" :user="userInfo" disabled/>
          <div class="flex flex-1 flex-col gap-[6px]">
            <div class="font-bold text-3xl">{{ userInfo?.name }}</div>
            <div class="font-semibold text-gray-600" v-if="userInfo?.sign">{{ userInfo?.sign }}</div>
            <div class="text-[12px] text-gray-400 flex items-center gap-[3px]">
              <n-time format="yyyy-MM-dd" :time="new Date(userInfo.createdAt)"></n-time>
              <span>加入</span>
            </div>
            <div class="flex">
              <span class="inline-block w-[80px]">个人简介：</span>
              <span>{{ userInfo?.introduce || '无' }}</span>
            </div>
          </div>
          <div class="flex items-end" v-if="myInfo?.id === userInfo.id">
            <n-button type="primary" @click="navigateTo({ name: 'user-profile' })">编辑资料</n-button>
          </div>
        </div>
      </n-card>

      <n-card class="mt-12">
        <n-tabs type="line" v-model:value="contentType">
          <n-tab name="1">文章</n-tab>
          <n-tab name="2">别的东西</n-tab>
          <n-tab name="3">未想好</n-tab>
        </n-tabs>
        <BlogList :search-params="searchParams"/>
      </n-card>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {NCard, NButton, NTabs, NTab, NTime, createDiscreteApi} from 'naive-ui'
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

useHead(() => {
  return {
    title: userInfo.value?.name || '加载中...'
  }
})

getUserInfo()

async function getUserInfo() {
  const { message } = createDiscreteApi(["message"])
  try{
    loading.value = true
    const { result, success, code, msg } = await useFetchPost('/user/' + route.params.id, { })
    if(success){
      userInfo.value = result
      searchParams.uid = result.id
    }else{
      message.error(msg as string)
    }
    loading.value = false
  }catch (e) {
    loading.value = false
  }
}

</script>
