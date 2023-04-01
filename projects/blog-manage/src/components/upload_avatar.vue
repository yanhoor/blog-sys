<template>
  <el-upload
    class="avatar-uploader"
    :http-request="handleUpload"
    :show-file-list="false"
    ref="uploadRef"
  >
    <img v-if="props.url" :src="IMG_HOST + props.url" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import $http, { IMG_HOST, urls } from '@/http'
import { reactive, ref } from 'vue'
import type { UploadInstance, UploadRequestOptions } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Props {
  url?: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  size: '178px'
})

const emit = defineEmits(['update:url', 'change'])

const uploadRef = ref<UploadInstance>()

const handleUpload = async (options: UploadRequestOptions) => {
  try {
    const { success, result, msg } = await $http.post(
      urls.upload,
      { file: options.file, lastFilePath: props.url },
      true
    )
    if (!success) {
      ElMessage.error({
        message: msg
      })
    } else {
      emit('update:url', result.path)
      emit('change')
    }
  } catch (e) {}
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  :deep(.el-upload):hover {
    border-color: var(--el-color-primary);
  }
  .avatar {
    object-fit: contain;
  }
}
.el-icon.avatar-uploader-icon,
.avatar {
  font-size: 28px;
  color: #8c939d;
  width: v-bind('props.size');
  height: v-bind('props.size');
  text-align: center;
}
</style>
