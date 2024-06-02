<template>
  <LayoutMain>
    <el-card>
      <div class="text-4xl font-bold">个人资料</div>
      <el-divider></el-divider>
      <div class="mt-12">
        <el-form
          class="flex-1"
          ref="formRef"
          :model="postForm"
          :rules="rules"
          label-placement="left"
          label-width="120"
        >
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="postForm.name"
              @keydown.enter.prevent
              maxlength="8"
              show-count
              clearable
            />
          </el-form-item>
          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="postForm.gender" name="gender">
              <el-radio-button :value="0" label="未知" />
              <el-radio-button :value="1" label="男" />
              <el-radio-button :value="2" label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="birthday" label="生日">
            <el-date-picker
              type="date"
              v-model="postForm.birthday"
              :is-date-disabled="(ts) => ts > Date.now()"
              clearable
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="introduce" label="个人简介">
            <el-input
              v-model="postForm.introduce"
              type="textarea"
              @keydown.enter.prevent
              maxlength="80"
              show-count
              clearable
            />
          </el-form-item>
          <el-form-item prop="avatar" label="头像">
            <MediaUploadImg v-model="postForm.avatar" />
          </el-form-item>
          <el-form-item prop="profileCardBg" label="资料卡片背景">
            <MediaUploadImg v-model="postForm.profileCardBg" />
          </el-form-item>
        </el-form>
      </div>
      <div class="text-center">
        <el-button
          class="w-[80px]"
          type="primary"
          :loading="isProcessing"
          @click="handleSave"
          >保存修改</el-button
        >
      </div>
    </el-card>
  </LayoutMain>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { User } from 'sys-types'

definePageMeta({
  middleware: ['auth']
})
useHead({
  title: '个人资料'
})

const postForm = ref<User>({
  name: '',
  avatar: '',
  profileCardBg: '',
  mobile: '',
  id: '',
  gender: 0,
  birthday: 0,
  introduce: '',
  lock: 2
})
const formRef = ref<FormInstance | null>(null)
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

async function getProfile() {
  try {
    const { result, success, code, msg } = await useFetchGet('/user/info', {})
    if (success) {
      if (result.birthday) result.birthday = new Date(result.birthday).getTime()
      postForm.value = result
    } else {
      ElMessage.error(msg as string)
    }
  } catch (e) {}
}

async function handleSave() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        isProcessing.value = true
        const { result, success, msg } = await useFetchPost(
          '/user/update',
          postForm.value
        )
        isProcessing.value = false
        if (success) {
          ElMessage.success('保存成功')
        } else {
          ElMessage.error(msg as string)
        }
      } catch (e) {
        isProcessing.value = false
      }
    } else {
      console.log(errors)
      ElMessage.error('请将信息填写完整')
    }
  })
}
</script>
