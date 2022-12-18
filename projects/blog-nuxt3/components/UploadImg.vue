<template>
  <n-upload
    list-type="image"
    :show-file-list="false"
    :custom-request="customRequest"
    @preview="handlePreview"
  >
    <div class="group relative upload-action" v-if="props.modelValue">
      <img alt="头像" class="w-full h-full object-contain" :src="config.imageBase + props.modelValue">
      <div class="absolute cursor-pointer top-0 left-0 bottom-0 right-0 justify-center items-center gap-4 hidden group-hover:flex">
        <n-icon class="cursor-pointer hover:text-green-600" :component="ZoomIn24Regular" size="32" @click.stop="showModal = true"></n-icon>
        <!--<n-icon :component="Edit20Filled" size="32"></n-icon>-->
      </div>
    </div>
    <n-icon class="upload-action flex justify-center items-center cursor-pointer hover:text-green-600" size="70" :component="Add24Regular" v-else></n-icon>
  </n-upload>
  <n-modal
    v-model:show="showModal"
    preset="card"
    class="w-[600px]"
    title="预览"
  >
    <img alt="预览" :src="config.imageBase + props.modelValue" class="w-full">
  </n-modal>
</template>

<script setup lang="ts">
import { Add24Regular, ZoomIn24Regular, Edit20Filled } from '@vicons/fluent'
import { NUpload, NModal, NIcon, createDiscreteApi, UploadCustomRequestOptions} from 'naive-ui'

interface Props {
  modelValue?: string
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: '178px',
})
const emits = defineEmits(['update:modelValue'])
const previewImageUrl = ref('')
const showModal = ref(false)
const config = useRuntimeConfig()

const customRequest = async ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) => {
  try{
    console.log('==============', file, data)
    const {success, result, msg} = await useFetchPost('/upload', { file: file.file }, true)
    if(success){
      onFinish()
      emits('update:modelValue', result.path)
    }else{
      onError()
    }
  }catch (e) {
    onError()
  }
}

function handlePreview() {

}
</script>

<style lang="scss" scoped>
//.upload-img{
//  width: v-bind('props.size');
//  height: v-bind('props.size');
//}
.upload-action{
  @apply w-[178px] h-[178px] border border-dashed border-gray-300 hover:border-green-600 hover:opacity-80
}
</style>
