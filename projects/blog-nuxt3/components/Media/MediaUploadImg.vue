<template>
  <div class="media-upload-img">
    <input
      class="hidden"
      type="file"
      :accept="config.public.imageType"
      ref="inputRef"
      @change="handleSelectFileChange"
    />

    <div class="h-full w-full" @click="handleTriggerSelect">
      <slot name="preview" v-if="props.modelValue">
        <div class="upload-action limit-size group relative">
          <MediaImgView
            class="h-full w-full object-cover"
            :url="props.modelValue"
          />
          <n-icon-wrapper
            class="absolute -right-[8px] -top-[8px] cursor-pointer"
            :size="18"
            :border-radius="6"
            @click.stop="handleDeleteImage"
          >
            <Icon name="fluent:delete-24-regular"></Icon>
          </n-icon-wrapper>
          <div
            v-if="showPreviewIcon"
            class="absolute bottom-0 left-0 right-0 top-0 hidden cursor-pointer items-center justify-center gap-4 group-hover:flex"
          >
            <Icon
              name="fluent:zoom-in-20-regular"
              class="cursor-pointer text-white hover:text-primary"
              size="48"
              @click.stop="handlePreview"
            ></Icon>
          </div>
        </div>
      </slot>

      <div
        v-else
        class="limit-size flex flex-col items-center justify-center gap-[6px]"
        :class="{ 'upload-action': showBorder }"
      >
        <n-spin size="medium" v-if="uploading" />
        <slot name="trigger" v-else>
          <Icon
            name="fluent:add-20-regular"
            class="flex cursor-pointer items-center justify-center hover:text-primary"
            size="70"
          ></Icon>
          <span v-if="uploadTxt">{{ uploadTxt }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSpin, NIconWrapper } from 'naive-ui'
import { api as viewerApi } from 'v-viewer'
import { MediaFile } from 'sys-types'
import FileUtil from '~/utils/fileUtil'

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

  const { message } = useDiscreteApi(['message'])
  const fileUtil = new FileUtil(file)
  await fileUtil.init()
  // console.log('==============', md5)
  let mediaFile
  try {
    const oldFile = await handleCheckFile(fileUtil)

    if (oldFile) {
      mediaFile = oldFile
    } else if (fileUtil.isSplit) {
      mediaFile = await handlePartUpload(fileUtil)
    } else {
      mediaFile = await handleUploadSingle({ file })
    }
    if (mediaFile) {
      emits('update:modelValue', mediaFile.url)
      emits('complete', mediaFile)
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

<style lang="postcss" scoped>
.limit-size {
  width: v-bind('props.width');
  height: v-bind('props.height');
}
.upload-action {
  @apply border border-dashed border-gray-300 hover:border-green-600 hover:opacity-80;
}
</style>
