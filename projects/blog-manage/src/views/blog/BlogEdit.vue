<template>
  <el-form :model="postForm" :rules="formRules" ref="formRef" label-width="120px" disabled>
    <el-form-item prop="title" label="标题">
      <el-input v-model="postForm.title"></el-input>
    </el-form-item>
    <el-form-item prop="cateId" label="分类">
      <el-select v-model="postForm.cateId">
        <el-option :key="item.id" :value="item.id" :label="item.name" v-for="item of pageState.cateList"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="content" label="内容" class="content-editor">
      <Editor
        :init="editorInit"
        disabled
        v-model="postForm.content"
      />
    </el-form-item>
  </el-form>
  <!--<el-button type="primary" @click="handleSave(formRef)">保存</el-button>-->
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Blog } from '@/types/blog'
import type { FormRules, FormInstance } from 'element-plus'
import $http, { urls, IMG_HOST } from "@/http"
import {ElMessage} from "element-plus"
import { useRoute, useRouter } from 'vue-router'
import Editor from '@tinymce/tinymce-vue'

const editorInit = {
  plugins: 'lists link image table code help wordcount codesample',
  // images_upload_base_path: IMG_HOST,
  images_upload_url: '/upload', // 有这个才会显示上传图片
  images_upload_handler(blobInfo: any, progress: number) {
    return new Promise(async (resolve, reject) => {
      try{
        const formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        const {success, result, msg} = await $http.post(urls.upload, {file: blobInfo.blob()}, true)
        if(!success){
          ElMessage.error({
            message: msg
          })
        }else{
          resolve(IMG_HOST + result.path)
        }
      }catch (e) {
        reject('上传照片失败')
      }
    })
  }
}
const route = useRoute()
const router = useRouter()
const pageState = reactive({
  cateList: []
})
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

getAllCate()

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
    const {success, result, msg} = await $http.post(urls.blog_edit, postForm.value)
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      ElMessage.success({
        message: '保存成功'
      })
      router.go(-1)
    }
  }catch (e) {

  }
}

async function getAllCate(){
  try{
    const {success, result, msg} = await $http.post(urls.blog_cate_all)
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      pageState.cateList = result
    }
  }catch (e) {

  }
}
</script>

<style lang="scss" scoped>
.content-editor{
  :deep(.tox-tinymce){
    width: 100%;
    height: 900px !important;
  }
}
</style>
