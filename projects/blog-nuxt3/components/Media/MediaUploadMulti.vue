<template>
  <n-upload
    abstract
    :accept="acceptType"
    list-type="image"
    :show-file-list="false"
    :custom-request="customRequest"
  >
    <div class="flex flex-wrap gap-[12px]">
      <template v-for="(file, index) of modelValue" :key="file.url">
        <div class="flex justify-center items-center relative limit-size border border-dashed border-gray-300 hover:border-green-600" @click.stop>
          <MediaImgView alt="图像" class="object-cover overflow-clip" :url="file.url" v-if="config.imageType.includes(getFileExt(file.url))"/>
          <video :src="config.imageBase + file.url" v-else-if="config.videoType.includes(getFileExt(file.url))" controls></video>
          <n-icon :component="Document24Regular" size="48" v-else/>
          <n-icon-wrapper class="absolute -top-[8px] -right-[8px] cursor-pointer" :size="18" :border-radius="6" @click="handleDeleteItem(index)">
            <n-icon :component="Delete24Regular"/>
          </n-icon-wrapper>
        </div>
      </template>
      <n-upload-trigger #="{ handleClick }" abstract>
        <n-icon class="limit-size upload-action flex justify-center items-center cursor-pointer hover:text-green-600" size="70" :component="Add24Regular" @click="handleClick" v-if="uploadMode != 2 || (uploadMode == 2 && modelValue.length < 1)"></n-icon>
      </n-upload-trigger>
    </div>

  </n-upload>
</template>

<script setup lang="ts">
import { Add24Regular, ZoomIn24Regular, Edit20Filled, Document24Regular, Delete24Regular } from '@vicons/fluent'
import { NUpload, NModal, NIcon, NUploadTrigger, NIconWrapper, createDiscreteApi, UploadCustomRequestOptions} from 'naive-ui'
import { Media } from '@/types'

interface Props {
  modelValue: Media[]
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: '178px',
})
const emits = defineEmits(['update:modelValue'])
const uploadMode = ref(3) // 上传的类型，1--图片，2--视频, 3--视频/图片
const config = useRuntimeConfig()

watch(() => props.modelValue, (val) => {
  if(val.length && config.imageType.includes(getFileExt(val[0].url))){
    uploadMode.value = 1
  } else if(val.length && config.videoType.includes(getFileExt(val[0].url))){
    uploadMode.value = 2
  }else{
    uploadMode.value = 3
  }
})

const acceptType = computed(() => {
  switch (uploadMode.value) {
    case 1:
      return 'image/*'
    case 2:
      return 'video/*'
    case 3:
      return 'image/*,video/*'
  }
})

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
  const { message } = createDiscreteApi(["message"])
  // console.log('==============', file, data)
  try{
    if(uploadMode.value == 2 && props.modelValue.length === 1){
      message.error('最多上传一个视频')
      onError()
      return
    }
    if(uploadMode.value == 1 && config.videoType.includes(getFileExt(file.fullPath as string))){
      message.error('图片与视频不能同时上传')
      onError()
      return
    }
    if(uploadMode.value == 1 && file.file?.size && file.file?.size > 1024 * 1024 * 5){
      message.error('图片不能大于 5M')
      onError()
      return
    }
    const {success, result, msg} = await useFetchPost('/upload', { file: file.file }, true)
    if(success){
      onFinish()
      emits('update:modelValue', [...props.modelValue, { url: result.path }])
    }else{
      message.error(msg as string)
      onError()
    }
  }catch (e) {
    onError()
  }
}

function getFileExt(path: string) {
  const index = path.lastIndexOf('.')
  return path.slice(index + 1).toLowerCase()
}

function handleDeleteItem(idx: number) {
  const temp = props.modelValue.slice()
  temp.splice(idx, 1)
  emits('update:modelValue', temp)
}

</script>

<style lang="scss" scoped>
.limit-size{
    width: v-bind('props.size');
    height: v-bind('props.size');
}
.upload-action{
  @apply border border-dashed border-gray-300 hover:border-green-600 hover:opacity-80
}
img,video{
  @apply w-full h-full
}
</style>
