<template>
  <el-form :model="postForm" :rules="formRules" ref="formRef" label-width="120px">
    <el-form-item prop="name" label="名称">
      <el-input v-model="postForm.name"></el-input>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BlogCate } from '@/types/blogCate'
import type { FormRules, FormInstance } from 'element-plus'
import $http, { urls } from "@/http"
import {ElMessage} from "element-plus"

interface Props{
  postForm: BlogCate
}

const props = defineProps<Props>()
const emits = defineEmits(['complete'])

const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ]
})
const formRef = ref<FormInstance>()

async function handleSave(formEl: FormInstance | undefined){
  try{
    await formEl?.validate()
    const {success, result, msg} = await $http.post(urls.blog_cate_edit, props.postForm)
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
