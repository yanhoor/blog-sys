<template>
  <NuxtLayout name="empty">
    <div class="write-blog-container">
      <n-form ref="formRef" :model="postForm" :rules="rules">
        <n-form-item path="title" label="标题">
          <n-input v-model:value="postForm.title" @keydown.enter.prevent placeholder="请输入标题" size="large" maxlength="30" show-count clearable/>
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
          <client-only>
            <MiniMCE v-model="postForm.content" />
          </client-only>
        </n-form-item>
      </n-form>
      <div class="action-container">
        <n-button type="primary" @click="handlePost">发布</n-button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { NButton, NIcon, NGrid, NCard, NSpace, NGridItem, NSelect, NForm, NFormItem, NInput, FormInst, FormRules, FormItemRule, FormItemInst, createDiscreteApi } from "naive-ui"
import { Blog, BlogCate } from '@/types'
import {useFetchPost} from "~/composables/useBaseFetch";

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
        const { result, success, msg } = await useFetchPost('/blog/edit', postForm.value)
        if(success){
          message.success('发布成功')
          await navigateTo('/', { replace: true })
        } else{
          message.error(msg as string)
        }
      }catch (e) {

      }
    } else {
      console.log(errors)
      message.error('请将信息填写完整')
    }
  })
}
</script>

<style lang="scss" scoped>
.write-blog-container{
  margin: 20px 150px;
  .action-container{
    text-align: center;
    .n-button{
      width: 200px;
    }
  }
}
</style>
