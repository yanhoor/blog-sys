<template>
  <div class="mx-[150px] p-12 min-h-full">
    <n-form ref="formRef" :model="postForm" :rules="rules">
      <n-form-item path="content" label="内容">
        <n-input
          :value="postForm.content"
          @keydown.enter.prevent
          type="textarea"
          placeholder="请输入"
          size="large"
          show-count
          clearable
          :autosize="{
            minRows: 5
          }"
        />
      </n-form-item>
      <n-form-item path="medias" label="媒体">
        <!--<n-upload
          v-model:file-list="postForm.medias"
          @finish="handleFinish"
          :custom-request="customRequest"
          :show-preview-button="false"
          list-type="image-card"
        >
        </n-upload>-->
        <CustomUpload v-model="postForm.medias"/>
      </n-form-item>
    </n-form>
    <div class="text-center">
      <n-button class="w-[200px]" type="primary" @click="handlePost" :loading="
        isProcessing">发布</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadFileInfo } from "naive-ui"
import {
  NButton,
  NIcon,
  NUpload,
  NCard,
  NSpace,
  NGridItem,
  NSelect,
  NForm,
  NFormItem,
  NInput,
  FormInst,
  FormRules,
  FormItemRule,
  FormItemInst,
  createDiscreteApi,
  UploadCustomRequestOptions
} from "naive-ui"
import { Blog, BlogCate } from '@/types'
import {useFetchPost} from "~/composables/useBaseFetch";

useHead({
  title: '写文章'
})
definePageMeta({
  layout: "empty",
})

interface BlogForm extends Blog{
  isPost?: number
}
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
const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  content: [
    {
      required: true,
      message: '请输入内容'
    }
  ]
}

getBlogInfo()

async function handlePost(){
  formRef.value?.validate(async (errors) => {
    const { message } = createDiscreteApi(["message"])
    if (!errors) {
      try{
        isProcessing.value = true
        const { result, success, msg } = await useFetchPost('/blog/edit', postForm.value)
        isProcessing.value = false
        if(success){
          message.success('发布成功')
          await navigateTo('/', { replace: true })
        } else{
          message.error(msg as string)
        }
      }catch (e) {
        isProcessing.value = false
      }
    } else {
      console.log(errors)
      message.error('请将信息填写完整')
    }
  })
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

const customRequest = async ({
                               file,
                               data,
                               headers,
                               withCredentials,
                               action,
                               onFinish,
                               onError,
                               onProgress
                             }: UploadCustomRequestOptions) => {
  const { message } = createDiscreteApi(["message"])
  // console.log('==============', file, data)
  try{
    if(file.file?.size && file.file?.size > 1024 * 1024 * 5){
      message.error('文件不能大于 5M')
      onError()
      return
    }
    const {success, result, msg} = await useFetchPost('/upload', { file: file.file }, true)
    if(success){
      file.url = result.path
      postForm.value.medias.push({
        url: result.path as string
      })
      onFinish()
    }else{
      message.error(msg as string)
      onError()
    }
  }catch (e) {
    onError()
  }
}
const handleFinish = ({
                        file,
                        event
                      }: {
  file: UploadFileInfo
  event?: ProgressEvent
}) => {
  console.log('-------------', file)
  // message.success((event?.target as XMLHttpRequest).response)
  const ext = file.name.split('.')[1]
  // file.name = `更名.${ext}`
  // file.url = '__HTTPS__://www.mocky.io/v2/5e4bafc63100007100d8b70f'
  return file
}
</script>

