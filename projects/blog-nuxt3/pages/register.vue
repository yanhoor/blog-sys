<template>
  <n-card class="w-[350px] relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <n-form ref="formRef" :model="registerForm" :rules="rules">
      <n-form-item path="name" label="名称">
        <n-input v-model:value="registerForm.name" @keydown.enter.prevent maxlength="20" show-count/>
      </n-form-item>
      <n-form-item path="mobile" label="手机号">
        <n-input v-model:value="registerForm.mobile" @keydown.enter.prevent maxlength="11" show-count/>
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input
          v-model:value="registerForm.password"
          type="password"
          @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item
        ref="rPasswordFormItemRef"
        first
        path="reenteredPassword"
        label="重复密码"
      >
        <n-input
          v-model:value="registerForm.reenteredPassword"
          :disabled="!registerForm.password"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-space vertical>
        <n-button
          class="w-full"
          type="primary"
          @click="handleRegister"
        >
          注册
        </n-button>
        <n-button
          class="w-full"
          @click="toLogin"
        >
          已有账号，去登录
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { CommentMultiple16Regular, ThumbLike16Regular } from '@vicons/fluent'
import {useFetchPost} from "@/composables/useBaseFetch"
import { NButton, NIcon, NGrid, NCard, NSpace, NGridItem, NForm, NFormItem, NInput, FormInst, FormRules, FormItemRule, FormItemInst, createDiscreteApi } from "naive-ui"
import {useColorMode} from "@vueuse/core";


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
  reenteredPassword: '',
})
const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
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

function handlePasswordInput () {
  if (registerForm.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}

function validatePasswordStartWith (
  rule: FormItemRule,
  value: string
): boolean {
  return (
    !!registerForm.value.password &&
    registerForm.value.password.startsWith(value) &&
    registerForm.value.password.length >= value.length
  )
}
function validatePasswordSame (rule: FormItemRule, value: string): boolean {
  return value === registerForm.value.password
}
function handleRegister (e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    const { message } = createDiscreteApi(["message"])
    if (!errors) {
      try{
        const { result, success } = await useFetchPost('/user/register', registerForm.value)
        if(success){
          message.success('注册成功')
          toLogin()
        }
      }catch (e) {

      }
    } else {
      console.log(errors)
      message.error('请将信息填写完整')
    }
  })
}

async function toLogin() {
  await navigateTo('/login', { replace: true })
}
</script>

<style lang="scss" scoped>
.form-container{
  width: 350px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
