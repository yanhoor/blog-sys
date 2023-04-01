<template>
  <!--出现错误时会自动进入这个页面-->
  <div
    class="w-full h-full flex flex-col items-center justify-center gap-12 px-12 py-12 box-border"
  >
    <div>
      <n-result
        status="404"
        title="404 页面不存在"
        description="生活总归带点荒谬"
        v-if="error?.statusCode == 404"
      >
        <template #footer>
          <n-button @click="() => clearError({ redirect: '/' })" type="primary"
            >返回首页</n-button
          >
        </template>
      </n-result>
      <n-result
        status="500"
        title="500 服务器错误"
        description="人生总难免会犯点错误"
        v-else
      >
        <template #footer>
          <n-button @click="() => clearError({ redirect: '/' })" type="primary"
            >返回首页</n-button
          >
        </template>
      </n-result>
    </div>
    <n-alert :title="error?.statusCode" type="error" class="overflow-y-auto">
      <n-descriptions label-placement="top" :column="1">
        <n-descriptions-item>
          <template #label> Message </template>
          {{ error?.message }}
        </n-descriptions-item>
        <n-descriptions-item>
          <template #label> Stack </template>
          {{ error?.stack }}
        </n-descriptions-item>
      </n-descriptions>
    </n-alert>
  </div>
</template>

<script lang="ts" setup>
import {
  NButton,
  NAlert,
  NDescriptions,
  NDescriptionsItem,
  NResult
} from 'naive-ui'

useHead(() => {
  return {
    title: props.error?.statusCode
  }
})
const props = defineProps({ error: Object })
</script>
