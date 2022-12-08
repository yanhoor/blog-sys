<template>
  <!--出现错误时会自动进入这个页面-->
  <div class="page-container">
    <n-result status="404" title="404 页面不存在" description="生活总归带点荒谬" v-if="error.statusCode === 404">
      <template #footer>
        <n-button @click="() => clearError({ redirect: '/' })" type="primary">返回首页</n-button>
      </template>
    </n-result>
    <n-result
      status="500"
      title="500 服务器错误"
      description="人生总难免会犯点错误"
      v-else
    >
      <template #footer>
        <n-button @click="navigateTo('/', { replace: true })" type="primary">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
import {
  NButton,
  NResult
} from "naive-ui"

const props = defineProps({  error: Object })
</script>

<style lang="scss" scoped>
.page-container{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
