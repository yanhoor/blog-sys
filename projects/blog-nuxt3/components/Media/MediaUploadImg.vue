<template>
  <div class="media-upload-img">
    <input
      class="hidden"
      type="file"
      :accept="config.public.imageType"
      ref="inputRef"
      @change="handleSelectFileChange"
    />

    <div class="w-full h-full" @click="handleTriggerSelect">
      <slot name="preview" v-if="props.modelValue">
        <div class="group relative upload-action limit-size">
          <MediaImgView
            class="w-full h-full object-cover"
            :url="props.modelValue"
          />
          <n-icon-wrapper
            class="absolute -top-[8px] -right-[8px] cursor-pointer"
            :size="18"
            :border-radius="6"
            @click.stop="handleDeleteImage"
          >
            <n-icon :component="Delete24Regular" />
          </n-icon-wrapper>
          <div
            v-if="showPreviewIcon"
            class="absolute cursor-pointer top-0 left-0 bottom-0 right-0 justify-center items-center gap-4 hidden group-hover:flex"
          >
            <n-icon
              class="cursor-pointer text-white hover:text-green-600"
              :component="ZoomIn24Regular"
              size="48"
              @click.stop="handlePreview"
            ></n-icon>
          </div>
        </div>
      </slot>

      <div
        v-else
        class="limit-size flex flex-col justify-center items-center gap-[6px]"
        :class="{ 'upload-action': showBorder }"
      >
        <n-spin size="medium" v-if="uploading" />
        <slot name="trigger" v-else>
          <n-icon
            class="flex justify-center items-center cursor-pointer hover:text-green-600"
            size="70"
            :component="Add24Regular"
          ></n-icon>
          <span v-if="uploadTxt">{{ uploadTxt }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Add24Regular,
  ZoomIn24Regular,
  Edit20Filled,
  Delete24Regular
} from '@vicons/fluent'
import { NIcon, NSpin, createDiscreteApi, NIconWrapper } from 'naive-ui'
import { api as viewerApi } from 'v-viewer'
import { MediaFile } from 'sys-types'

interface Props {
  modelValue?: string
  width?: string
  height?: string
  uploadTxt?: string
  showPreviewIcon?: boolean
  showBorder?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  showPreviewIcon: true,
  showBorder: true,
  width: '178px',
  height: '178px'
})
const emits = defineEmits<{
  'update:modelValue': [url: string]
  complete: [result: MediaFile]
}>()
const config = useRuntimeConfig()
const uploading = ref(false)
const inputRef = ref<HTMLInputElement>()

function handleTriggerSelect() {
  if (uploading.value) return

  inputRef.value?.click()
}

async function handleSelectFileChange(e: Event) {
  const target: HTMLInputElement = e.target as HTMLInputElement
  // console.log('=========handleSelectFile=========', e.target.files)
  if (!target.files) return

  const fileList: FileList = target.files

  const uploadList: Promise<any>[] = []
  for (const file of fileList) {
    uploadList.push(handleUploadFile(file))
  }

  try {
    uploading.value = true
    await Promise.all(uploadList)
    uploading.value = false
  } catch (e) {
    uploading.value = false
  }
}

async function handleUploadFile(file: File) {
  if (!config.public.imageType.includes(getFileExt(file.name))) return

  const { message } = createDiscreteApi(['message'])
  // console.log('==============', md5)
  try {
    const { success, result, msg } = await useFetchPost(
      '/upload',
      { file },
      true
    )
    if (success) {
      emits('update:modelValue', result.url)
      emits('complete', result as MediaFile)
    } else {
      message.error(msg as string)
    }
  } catch (e) {
    message.error('上传失败')
  }
}

function handleDeleteImage() {
  emits('update:modelValue', '')
  emits('complete', undefined)
}

function getFileExt(path: string) {
  const index = path.lastIndexOf('.')
  return path.slice(index).toLowerCase()
}

function handlePreview() {
  viewerApi({ images: [config.public.imageBase + props.modelValue] })
}
</script>

<style lang="scss" scoped>
.limit-size {
  width: v-bind('props.width');
  height: v-bind('props.height');
}
.upload-action {
  @apply border border-dashed border-gray-300 hover:border-green-600 hover:opacity-80;
}
</style>
