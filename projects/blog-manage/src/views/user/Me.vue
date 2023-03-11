<template>
  <el-descriptions
    :column="4"
    size="large"
    border
  >
    <el-descriptions-item label="头像" :span="4">
      <UploadAvatar v-model:url="formInfo.avatar" @change="changeAvatar" size="90px"/>
    </el-descriptions-item>
    <el-descriptions-item label="用户名">{{ formInfo.name }}</el-descriptions-item>
    <el-descriptions-item label="手机号">{{ formInfo.mobile }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/userStore"
import { ref } from 'vue'
import UploadAvatar from '@/components/upload_avatar.vue'
import $http, {urls} from "@/http"
import {ElMessage} from "element-plus"

const userStore = useUserStore()
const formInfo = ref(userStore.user)

async function changeAvatar(){
  try{
    const {success, result, msg} = await $http.post(urls.user_update_avatar, formInfo.value)
    if(!success){
      ElMessage.error({
        message: msg
      })
    }else{
      userStore.getUserInfo()
    }
  }catch (e) {

  }
}
</script>
