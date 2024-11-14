<template>
  <div class="media-upload-img">
    <input
      ref="inputRef"
      class="hidden"
      type="file"
      :accept="config.public.imageType"
      @change="handleSelectFileChange"
    />

    <div class="h-full w-full" @click="handleTriggerSelect">
      <slot v-if="props.modelValue" name="preview">
        <div class="upload-action limit-size group relative">
          <MediaImgView
            class="h-full w-full object-cover"
            :url="props.modelValue"
          />
          <el-button
            class="absolute -right-[8px] -top-[8px] cursor-pointer"
            circle
            type="success"
            @click.stop="handleDeleteImage"
          >
            <Icon #icon name="fluent:delete-24-regular" />
          </el-button>
          <div
            v-if="showPreviewIcon"
            class="absolute bottom-0 left-0 right-0 top-0 hidden cursor-pointer items-center justify-center gap-4 group-hover:flex"
          >
            <Icon
              name="fluent:zoom-in-20-regular"
              class="hover:text-primary cursor-pointer text-white"
              size="48"
              @click.stop="handlePreview"
            />
          </div>
        </div>
      </slot>

      <div
        v-else
        class="limit-size flex flex-col items-center justify-center gap-[6px]"
        :class="{ 'upload-action': showBorder }"
      >
        <div v-if="uploading" v-loading />
        <slot v-else name="trigger">
          <Icon
            name="fluent:add-20-regular"
            class="hover:text-primary flex cursor-pointer items-center justify-center"
            size="70"
          />
          <span v-if="uploadTxt">{{ uploadTxt }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api as viewerApi } from 'v-viewer'
import type { MediaFile } from 'sys-types'
import { FileUtil, FileType } from 'sys-types'

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
  complete: [result: MediaFile | undefined]
}>()
const config = useRuntimeConfig()
const uploading = ref(false)
const inputRef = ref<HTMLInputElement>()
const { handleUploadSingle, handlePartUpload, handleCheckFile } =
  useUploadFile()
const { handleAliMultipartUpload } = useAliUpload()

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

  uploading.value = true
  await Promise.all(uploadList)
  uploading.value = false
  inputRef.value.value = ''
}

async function handleUploadFile(file: File) {
  if (!config.public.imageType.includes(getFileExt(file.name))) return

  const fileUtil = new FileUtil(file)
  await fileUtil.init()
  // console.log('==============', md5)
  let mediaFile
  try {
    const oldFile = await handleCheckFile(fileUtil)

    if (oldFile) {
      mediaFile = oldFile
    } else {
      mediaFile = await handleAliMultipartUpload(fileUtil, FileType.image)
    }
    // else if (fileUtil.isSplit) {
    //   mediaFile = await handlePartUpload(fileUtil)
    // } else {
    //   mediaFile = await handleUploadSingle({ file })
    // }
    if (mediaFile) {
      emits('update:modelValue', mediaFile.url)
      emits('complete', mediaFile)
    }
  } catch (e) {
    ElMessage.error('上传失败')
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

<style lang="postcss" scoped>
.limit-size {
  width: v-bind('props.width');
  height: v-bind('props.height');
}
.upload-action {
  @apply border border-dashed border-gray-300 hover:border-green-600 hover:opacity-80;
}
</style>
