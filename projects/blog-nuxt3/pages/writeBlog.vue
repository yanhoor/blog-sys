<template>
  <div class="mx-[150px] p-12 min-h-full">
    <n-form ref="formRef" :model="postForm" :rules="rules">
      <n-form-item path="title" label="标题">
        <n-input v-model:value="postForm.title" @keydown.enter.prevent placeholder="请输入标题" size="large" maxlength="60" show-count clearable/>
      </n-form-item>
      <n-form-item path="cateId" label="分类">
        <n-select
          v-model:value="postForm.cateId"
          size="large"
          :options="cateList"
          label-field="name"
          value-field="id"
          placeholder="请选择文章分类"
          filterable
          clearable
        />
      </n-form-item>
      <n-form-item path="content" label="内容">
        <MiniMCE v-model="postForm.content" />
      </n-form-item>
    </n-form>
    <div class="text-center">
      <n-button class="w-[200px]" type="primary" @click="handlePost" :loading="
        isProcessing">发布</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon, NGrid, NCard, NSpace, NGridItem, NSelect, NForm, NFormItem, NInput, FormInst, FormRules, FormItemRule, FormItemInst, createDiscreteApi } from "naive-ui"
import { Blog, BlogCate } from '@/types'
import {useFetchPost} from "~/composables/useBaseFetch";

useHead({
  title: '写文章'
})
definePageMeta({
  layout: "empty",
})

getAllCate()

interface BlogForm extends Blog{
  isPost?: number
}
const config = useRuntimeConfig()
const cateList = ref<BlogCate[]>([])
const postForm = ref<BlogForm>({
  id: '',
  title: '',
  content: '',
  isPost: 1,
  cateId: undefined, // 空字符不会显示 placeholder
})
const isProcessing = ref(false)
const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  title: [
    {
      required: true,
      message: '请输入标题'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入内容'
    }
  ]
}

async function getAllCate(){
  try{
    const {success, result, msg} = await useFetchPost('/blogCate/all', {})
    if(success){
      cateList.value = result
    }else{
    }
  }catch (e) {

  }
}

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
</script>

