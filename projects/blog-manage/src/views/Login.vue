<template>
  <div class="login-container">
    <el-card style="width: 350px">
      <el-form ref="formRef" :model="postForm" :rules="formRules" label-width="100px" v-if="!isRegister">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="postForm.mobile" maxlength="11"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="postForm.password" type="password" show-password/>
        </el-form-item>
      </el-form>
      <el-form ref="formRef" :model="registerForm" :rules="formRules" label-width="100px" v-else>
        <el-form-item label="名称" prop="name">
          <el-input v-model="registerForm.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="registerForm.mobile" maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" show-password/>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button type="primary" style="width: 100%" @click="handleRegister(formRef)" v-if="isRegister">注册</el-button>
        <el-button type="primary" style="width: 100%" @click="handleLogin(formRef)" v-else>登录</el-button>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-button style="width: 100%" @click="switchRegister">{{ isRegister ? '已账号，去登录' : '没有账号，去注册' }}</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import $http, { urls } from '@/http'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRules = reactive<FormRules>({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { len: 11, message: '请输入11位手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'change' }
  ],
})

const isRegister = ref(false)
const formRef = ref<FormInstance>()
const router = useRouter()

const postForm = reactive({
  mobile: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  avatar: '',
  mobile: '',
  password: ''
})


const switchRegister = () => {
  isRegister.value = !isRegister.value
}

const handleLogin = async (formEl: FormInstance | undefined) => {
  try{
    await formEl?.validate()
    const {success, result, msg} = await $http.post(urls.login, postForm)
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      localStorage.setItem('sit', result)
      await router.replace('/home')
    }
  }catch (e) {

  }
}

const handleRegister = async (formEl: FormInstance | undefined) => {
  try{
    await formEl?.validate()
    const {success, result, msg} = await $http.post(urls.user_register, registerForm)
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      ElMessage.success({
        message: '注册成功'
      })
      switchRegister()
    }
  }catch (e) {

  }
}
</script>

<style lang="less" scoped>
.login-container{
  width: 100%;
  height: 100%;
  background-color: darkslategrey;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
