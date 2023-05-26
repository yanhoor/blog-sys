<template>
  <el-form :model="editForm">
    <el-form-item label="更新平台">
      <el-select v-model="editForm.platform">
        <el-option label="安卓" value="android"></el-option>
        <el-option label="IOS" value="ios"></el-option>
        <el-option label="小程序" value="miniProgram"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="版本号">
      <el-input v-model="editForm.version"></el-input>
    </el-form-item>
    <el-form-item label="下载地址">
      <UploadAvatar v-model="editForm.url"></UploadAvatar>
    </el-form-item>
    <el-form-item label="更新记录">
      <el-input
        v-model="editForm.changeLog"
        type="textarea"
        rows="5"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import UploadAvatar from '@/components/upload_avatar.vue'

const editForm = ref({
  platform: '',
  url: '',
  version: '',
  changeLog: ''
})
</script>
