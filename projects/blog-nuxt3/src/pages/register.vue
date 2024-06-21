<template>
  <el-card
    class="relative left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2"
  >
    <el-form
      ref="formRef"
      :model="registerForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item prop="name" label="名称">
        <el-input
          v-model="registerForm.name"
          @keydown.enter.prevent
          maxlength="20"
          show-count
        />
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input
          v-model="registerForm.mobile"
          @keydown.enter.prevent
          maxlength="11"
          show-count
        />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          v-model="registerForm.password"
          type="password"
          @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </el-form-item>
      <el-form-item
        ref="rPasswordFormItemRef"
        first
        path="reenteredPassword"
        label="重复密码"
      >
        <el-input
          v-model="registerForm.reenteredPassword"
          :disabled="!registerForm.password"
          type="password"
          @keydown.enter.prevent
        />
      </el-form-item>
      <div class="mt-[20px] flex w-full flex-col gap-[20px]">
        <el-button class="w-full" type="primary" @click="handleRegister">
          注册
        </el-button>
        <el-button class="!ml-0 w-full" @click="toLogin">
          已有账号，去登录
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import type {
  FormInstance,
  FormRules,
  FormItemRule,
  FormItemInstance
} from 'element-plus'
import { useColorMode } from '@vueuse/core'
import { Encrypt } from 'sys-types'

const colorModel = useColorMode()

onMounted(() => {
  const s = localStorage.getItem('vueuse-color-scheme')
  colorModel.value = s === 'dark' ? 'dark' : 'light'
})

useHead({
  title: 'Register'
})
definePageMeta({
  layout: false
})

interface ModelType {
  mobile: string | null
  name: string | null
  password: string | null
  reenteredPassword: string | null
}

const registerForm = ref<ModelType>({
  mobile: '',
  name: '',
  password: '',
  reenteredPassword: ''
})
const formRef = ref<FormInstance | null>(null)
const rPasswordFormItemRef = ref<FormItemInstance | null>(null)
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入名称'
    }
  ],
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
  ],
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
}

function handlePasswordInput() {
  if (registerForm.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!registerForm.value.password &&
    registerForm.value.password.startsWith(value) &&
    registerForm.value.password.length >= value.length
  )
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === registerForm.value.password
}
function handleRegister(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const { result, success } = await $HttpUtils.post('/user/register', {
          mobile: registerForm.value.mobile,
          name: registerForm.value.name,
          password: Encrypt(registerForm.value.password)
        })
        if (success) {
          ElMessage.success('注册成功')
          toLogin()
        }
      } catch (e) {}
    } else {
      console.log(errors)
      ElMessage.error('请将信息填写完整')
    }
  })
}

async function toLogin() {
  await navigateTo('/login', { replace: true })
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
