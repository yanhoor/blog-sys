<template>
  <n-card>
    <div class="font-bold text-4xl">个人资料</div>
    <n-divider></n-divider>
    <div class="flex items-start mt-12 gap-12">
      <n-form class="flex-1" ref="formRef" :model="postForm" :rules="rules" label-placement="left" label-width="120">
        <n-form-item path="name" label="名称">
          <n-input v-model:value="postForm.name" @keydown.enter.prevent maxlength="20" show-count clearable/>
        </n-form-item>
        <n-form-item path="gender" label="性别">
          <n-radio-group v-model:value="postForm.gender" name="gender">
            <n-radio-button
              :value="0"
              label="未知"
            />
            <n-radio-button
              :value="1"
              label="男"
            />
            <n-radio-button
              :value="2"
              label="女"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item path="birthday" label="生日">
          <n-date-picker type="date" v-model:value="postForm.birthday" :is-date-disabled="(ts) => ts > Date.now()" clearable>
          </n-date-picker>
        </n-form-item>
        <n-form-item path="sign" label="个人签名">
          <n-input v-model:value="postForm.sign" @keydown.enter.prevent maxlength="20" show-count clearable/>
        </n-form-item>
        <n-form-item path="introduce" label="个人简介">
          <n-input v-model:value="postForm.introduce" type="textarea" @keydown.enter.prevent maxlength="50" show-count clearable/>
        </n-form-item>
      </n-form>
      <div>
        <UploadImg v-model="postForm.avatar"/>
      </div>
    </div>
    <div class="text-center">
      <n-button class="w-[80px]" type="primary" :loading="isProcessing" @click="handleSave">保存修改</n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {NCard, NButton, NRadioGroup, NRadioButton, NDatePicker, NDivider, NForm, NFormItem, NInput, FormInst, FormRules, createDiscreteApi} from 'naive-ui'
import { User } from "~/types"

definePageMeta({
  middleware: async (to, from) => {
    const { message } = createDiscreteApi(["message"])
    const token = useCookie('token')
    // console.log('=============', token, to.fullPath, from.fullPath)
    if(!token.value){
      message.error('请先登录')
      return navigateTo({ path: '/', replace: true })
    }
  }
})
useHead({
  title: '个人资料'
})

const postForm = ref<User>({
  name: '',
  avatar: '',
  mobile: '',
  id: '',
  gender: 0,
  birthday: 0,
  sign: '',
  introduce: '',
  lock: 2,
})
const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入名称'
    }
  ]
}
const isProcessing = ref(false)

getProfile()

async function getProfile(){
  const { message } = createDiscreteApi(["message"])
  try{
    const { result, success, code, msg } = await useFetchGet('/user/info', { })
    if(success){
      if(result.birthday) result.birthday = new Date(result.birthday).getTime()
      postForm.value = result
    }else{
      message.error(msg as string)
    }
  }catch (e) {

  }
}

async function handleSave(){
  formRef.value?.validate(async (errors) => {
    const { message } = createDiscreteApi(["message"])
    if (!errors) {
      try{
        isProcessing.value = true
        const { result, success, msg } = await useFetchPost('/user/update', postForm.value)
        isProcessing.value = false
        if(success){
          message.success('保存成功')
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
