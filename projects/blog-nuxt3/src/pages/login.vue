<template>
  <el-card class="form-container">
    <el-form
      ref="formRef"
      :model="postForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item prop="mobile" label="手机号">
        <el-input
          v-model="postForm.mobile"
          @keydown.enter.prevent
          maxlength="11"
          show-count
          clearable
        />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          v-model="postForm.password"
          type="password"
          @keydown.enter.prevent
        />
      </el-form-item>
      <div class="mt-[20px] flex w-full flex-col gap-[20px]">
        <el-button class="w-full" type="primary" @click="handlePost">
          登录
        </el-button>
        <el-button class="!ml-0 w-full" @click="toRegister">
          没有账号，去注册
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Encrypt } from 'sys-types'

const token = useCookie('token', {
  maxAge: 60 * 60 * 24 * 7
})

useHead({
  title: 'Login'
})
definePageMeta({
  layout: false
})

interface ModelType {
  mobile: string | null
  password: string | null
}

const {$HttpUtils} = useNuxtApp()
const postForm = ref<ModelType>({
  mobile: '',
  password: ''
})
const formRef = ref<FormInstance | null>(null)
const rules: FormRules = {
  mobile: [
    {
      required: true,
      message: '请输入手机号'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ]
}
function handlePost(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (valid, fields) => {
    console.log('=========handlePost========', valid, fields, postForm.value)
    if (valid) {
      try {
        const { result, success, msg } = await $HttpUtils.post('/user/login', {
          ...postForm.value,
          password: Encrypt(postForm.value.password)
        })
        if (success) {
          ElMessage.success('登录成功')

          token.value = result
          await navigateTo('/', { replace: true })
          useFetchNotificationCount()
        } else {
          ElMessage.error(msg as string)
        }
      } catch (e) {}
    } else {
      console.log(valid, fields)
      ElMessage.error('请将信息填写完整')
    }
  })
}

async function toRegister() {
  await navigateTo('/register', { replace: true })
}
</script>

<style lang="postcss" scoped>
.form-container {
  width: 350px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
