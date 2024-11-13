<template>
  <!--出现错误时会自动进入这个页面-->
  <div
    class="box-border flex h-full w-full flex-col items-center justify-center gap-12 px-12 py-12"
  >
    <div>
      <el-result
        v-if="error?.statusCode == 404"
        icon="error"
        title="404 页面不存在"
        sub-title="生活总归带点荒谬"
      >
        <template #footer>
          <el-button type="primary" @click="() => clearError({ redirect: '/' })"
            >返回首页</el-button
          >
        </template>
      </el-result>
      <el-result
        v-else
        icon="error"
        title="500 服务器错误"
        sub-title="人生总难免会犯点错误"
      >
        <template #footer>
          <el-button type="primary" @click="() => clearError({ redirect: '/' })"
            >返回首页</el-button
          >
        </template>
      </el-result>
    </div>
    <el-alert
      :title="error?.statusCode?.toString()"
      type="error"
      class="overflow-y-auto"
    >
      <el-descriptions label-placement="top" :column="1">
        <el-descriptions-item label="Message">
          {{ error?.message }}
        </el-descriptions-item>
        <el-descriptions-item label="Stack">
          {{ error?.stack }}
        </el-descriptions-item>
      </el-descriptions>
    </el-alert>
  </div>
</template>

<script lang="ts" setup>
useHead(() => {
  return {
    title: props.error?.statusCode
  }
})
const props = defineProps({ error: Object })
</script>
