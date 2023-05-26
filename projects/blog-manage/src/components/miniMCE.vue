// 使用https://www.npmjs.com/package/minimce?activeTab=readme

<template>
  <div class="editor-container">
    <MiniMCE
      v-bind="$props"
      :disabled="disabled"
      :modelValue="modelValue"
      @update:modelValue="handleUpdate"
      :options="editorOptions"
    />
  </div>
</template>

<script setup lang="ts">
import MiniMCE from 'minimce'
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import '@/assets/zh-Hans'
import { reactive, ref } from 'vue'
import $http, { urls, IMG_HOST } from '@/http'
import { ElMessage } from 'element-plus'

const props = defineProps(['modelValue', 'disabled'])
const emits = defineEmits(['update:modelValue'])

const editorOptions = ref({
  plugins: 'lists link image table code help wordcount codesample',
  // images_upload_base_path: IMG_HOST,
  images_upload_url: '/upload', // 有这个才会显示上传图片
  images_upload_handler(blobInfo: any, progress: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        const { success, result, msg } = await $http.post(
          urls.upload,
          { file: blobInfo.blob() },
          true
        )
        if (!success) {
          ElMessage.error({
            message: msg
          })
        } else {
          resolve(IMG_HOST + result.path)
        }
      } catch (e) {
        reject('上传照片失败')
      }
    })
  }
})

function handleUpdate(val: string) {
  emits('update:modelValue', val)
}
</script>

<style lang="postcss" scoped>
.editor-container {
  width: 100%;
  :deep(.tox-tinymce) {
    width: 100%;
    height: 900px !important;
  }
}
</style>
