<template>
  <div class="w-full h-full flex flex-col items-start gap-[12px]">
    <n-input
      v-model:value="postForm.content"
      type="textarea"
      placeholder="请输入"
      size="large"
      show-count
      clearable
      :autosize="{
            minRows: 5,
            maxRows: 15
          }"
    />
    <CustomUpload v-model="postForm.medias" size="100px"/>
    <div class="text-center self-center">
      <n-button class="w-[200px]" type="primary" round @click="handlePost" :loading="isProcessing">发布</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NInput,
  createDiscreteApi
} from "naive-ui"
import { Blog } from '@/types'

useHead({
  title: '写文章'
})
definePageMeta({
  layout: "empty",
})

interface BlogForm extends Blog{
  isPost?: number
}
const fetchNewPost = useFetchNewPost()
const route = useRoute()
const config = useRuntimeConfig()
const postForm = ref<BlogForm>({
  id: '',
  content: '',
  isPost: 1,
  medias: [],
  cateId: undefined, // 空字符不会显示 placeholder
})
const isProcessing = ref(false)
const emit = defineEmits(['complete'])

getBlogInfo()

async function handlePost(){
  const { message } = createDiscreteApi(["message"])
  postForm.value.content = postForm.value.content.trim()
  if(!postForm.value.content){
    message.error('请输入内容')
    return
  }
  try{
    isProcessing.value = true
    const { result, success, msg } = await useFetchPost('/blog/edit', postForm.value)
    isProcessing.value = false
    if(success){
      message.success('发布成功')
      fetchNewPost.value = result
      emit('complete', result)
    } else{
      message.error(msg as string)
    }
  }catch (e) {
    isProcessing.value = false
  }
}

async function getBlogInfo(){
  if(!route.query.id) return

  try{
    const { result, success, msg, code } = await useFetchPost('/blog/info', { id: route.query.id })
    const { message } = createDiscreteApi(["message"])
    if(success){
      postForm.value = result
    } else if(code === 1) {
      message.error(msg as string)
      return navigateTo({  path: '/', replace: true })
    }
  }catch (e) {
    console.log('=====/blog/info=======', e)
  }
}
</script>

