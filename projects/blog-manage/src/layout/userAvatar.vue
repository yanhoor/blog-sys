<template>
  <div class="user-avatar-container">
    <el-dropdown>
      <el-avatar :src="userStore.user?.avatar"></el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="User">个人信息</el-dropdown-item>
          <el-dropdown-item :icon="CircleClose" @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/userStore'
import { User, CircleClose } from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox, FormInstance} from "element-plus"
import $http, {urls} from "@/http"
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

async function logout() {
  ElMessageBox.confirm(
    '确定退出登录？',
    '退出登录',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then( async () => {
    try{
      const {success, result, msg} = await $http.post(urls.logout)
      if(!success){
        ElMessage.error({
          message: msg
        })
      }else{
        localStorage.removeItem('sit')
        await router.replace('/login')
      }
    }catch (e) {

    }
  }).catch(() => {})
}
</script>

<style lang="less" scoped>
.el-avatar{
  cursor: pointer;
}
</style>
