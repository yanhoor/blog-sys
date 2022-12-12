// 使用https://www.npmjs.com/package/minimce?activeTab=readme

<template>
  <div class="editor-container w-full">
    <MiniMCE v-bind="attrs" :options="editorOptions"/>
  </div>
</template>

<script setup lang="ts">
import MiniMCE from 'minimce'
import 'tinymce/skins/ui/oxide/skin.min.css' // 皮肤
import 'tinymce/themes/silver/theme' // 主题
import 'tinymce/icons/default/icons' // 图标
import '@/assets/zh-Hans'

const attrs = useAttrs()
const config = useRuntimeConfig()
const editorOptions = ref({
  language: 'zh-Hans',
  plugins: 'lists link image table code help wordcount codesample',
  images_upload_url: '/upload', // 有这个才会显示上传图片
  images_upload_handler(blobInfo: any, progress: number) {
    return new Promise(async (resolve, reject) => {
      try{
        const formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        const {success, result, msg} = await useFetchPost('/upload', {file: blobInfo.blob()}, true)
        if(success){
          resolve(config.imageBase + result.path)
        }else{

        }
      }catch (e) {
        reject('上传照片失败')
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.editor-container{
  :deep(.tox-tinymce){
    width: 100%;
    height: 900px !important;
  }
}
</style>
