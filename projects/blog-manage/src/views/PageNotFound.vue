<template>
  <el-result title="Error" sub-title="页面不存在，点击返回首页" icon="error">
    <template #extra>
      <el-button type="primary" @click="backToHome">返回首页</el-button>
    </template>
  </el-result>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const noExistPath = route.params.path
const backToHome = () => {
  router.replace('/')
}
</script>

<style lang="less" scoped>
.el-result{
  height: 100%;
}
</style>
