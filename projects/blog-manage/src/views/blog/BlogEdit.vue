<template>
  <el-form :model="postForm" :rules="formRules" ref="formRef" label-width="120px">
    <el-form-item prop="title" label="标题">
      <el-input v-model="postForm.title"></el-input>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Blog } from '@/types/blog'
import type { FormRules, FormInstance } from 'element-plus'
import $http, { urls } from "@/http"
import {ElMessage} from "element-plus"
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const emits = defineEmits(['complete'])
const postForm = ref<Blog>({
  id: '',
  title: '',
  content: '',
  cateId: '',
})

if(route.query.id){
  getFormInfo(route.query.id as string)
}
const formRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
})
const formRef = ref<FormInstance>()

async function getFormInfo(id: string) {
  try{
    const {success, result, msg} = await $http.post(urls.blog_info, { id })
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      postForm.value = result
    }
  }catch (e) {

  }
}

async function handleSave(formEl: FormInstance | undefined){
  try{
    await formEl?.validate()
    const {success, result, msg} = await $http.post(urls.blog_edit, postForm)
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      emits('complete')
      ElMessage.success({
        message: '保存成功'
      })
    }
  }catch (e) {

  }
}
</script>
