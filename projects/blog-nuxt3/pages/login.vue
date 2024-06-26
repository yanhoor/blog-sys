<template>
  <n-card class="form-container">
    <n-form ref="formRef" :model="postForm" :rules="rules">
      <n-form-item path="mobile" label="手机号">
        <n-input
          v-model:value="postForm.mobile"
          @keydown.enter.prevent
          maxlength="11"
          show-count
          clearable
        />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input
          v-model:value="postForm.password"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-space vertical>
        <n-button class="w-full" type="primary" @click="handlePost">
          登录
        </n-button>
        <n-button class="w-full" @click="toRegister">
          没有账号，去注册
        </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NSpace,
  NForm,
  NFormItem,
  NInput,
} from 'naive-ui'
import type {
  FormInst,
  FormRules,
} from 'naive-ui'
import { Encrypt } from '~/utils/crypto'

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

const postForm = ref<ModelType>({
  mobile: '',
  password: ''
})
const formRef = ref<FormInst | null>(null)
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
  formRef.value?.validate(async (errors) => {
    const { message } = useDiscreteApi(['message'])
    if (!errors) {
      try {
        const { result, success, msg } = await useFetchPost('/user/login', {
          ...postForm.value,
          password: Encrypt(postForm.value.password)
        })
        if (success) {
          message.success('登录成功')

          token.value = result
          await navigateTo('/', { replace: true })
          useFetchNotificationCount()
        } else {
          message.error(msg as string)
        }
      } catch (e) {}
    } else {
      console.log(errors)
      message.error('请将信息填写完整')
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
