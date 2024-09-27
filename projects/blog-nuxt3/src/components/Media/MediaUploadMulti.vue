<template>
  <div class="media-upload-multi flex w-full flex-col items-center gap-[12px]">
    <input
      class="hidden"
      type="file"
      :accept="acceptType"
      ref="inputRef"
      :multiple="uploadMode === 2"
      @change="handleSelectFileChange"
    />

    <div class="flex items-center justify-center gap-[12px]">
      <el-button
        round
        tertiary
        type="primary"
        :disabled="lockUploadMode && uploadMode !== 2"
        @click="handleSelectUploadType(2)"
      >
        <template #icon>
          <Icon name="fluent:image-add-20-regular"></Icon>
        </template>
        图片
      </el-button>
      <el-button
        round
        tertiary
        type="primary"
        :disabled="lockUploadMode && uploadMode !== 3"
        @click="handleSelectUploadType(3)"
      >
        <template #icon>
          <Icon name="fluent:video-add-20-regular"></Icon>
        </template>
        视频
      </el-button>
      <el-button
        round
        tertiary
        type="primary"
        :disabled="lockUploadMode && uploadMode !== 4"
        @click="handleSelectUploadType(4)"
      >
        <template #icon>
          <Icon name="fluent:sound-wave-circle-20-regular"></Icon>
        </template>
        录音
      </el-button>
    </div>

    <MediaAudioRecord
      ref="audioRecorderRef"
      @complete="handleAudioRecordComplete"
      v-if="uploadMode === 4"
    />

    <div v-loading v-if="uploading"></div>

    <div
      class="my-[12px] w-full text-center"
      v-if="audioRecordFile && uploadMode === 4"
    >
      <el-button round type="primary" @click="handleUploadAudio"
        >上传录音</el-button
      >
    </div>

    <template v-if="modelValue.length">
      <div
        class="flex max-h-full w-full flex-wrap gap-[12px] overflow-y-auto pt-[12px]"
        v-if="uploadMode === 2"
        v-auto-animate
      >
        <div
          v-for="(media, index) of modelValue"
          :key="media.file.url"
          class="limit-size relative flex items-center justify-center border border-dashed border-gray-300 hover:border-green-600"
          @click.stop
        >
          <MediaImgView
            class="overflow-clip object-cover"
            :url="media.file.url"
          />
          <el-button
            class="absolute -right-[8px] -top-[8px] cursor-pointer"
            circle
            type="success"
            @click="handleDeleteItem(index)"
          >
            <Icon #icon name="fluent:delete-16-regular"></Icon>
          </el-button>
        </div>
      </div>

      <div
        class="relative h-0 w-full pt-[56.25%]"
        v-if="[3, 4].includes(uploadMode)"
      >
        <MediaUploadImg
          @complete="handleUploadCoverComplete"
          :model-value="coverFile?.url"
          class="absolute top-0 h-full w-full"
          width="100%"
          height="100%"
          uploadTxt="点击上传封面"
        />
      </div>

      <div
        class="flex w-full flex-col items-center gap-[12px]"
        v-if="uploadMode === 3"
      >
        <MediaVideoItem :url="modelValue[0].file.url" />
        <el-button round type="danger" @click="handleDeleteItem(0)"
          >删除视频</el-button
        >
      </div>
      <el-button
        v-if="uploadMode === 4"
        round
        type="danger"
        @click="handleDeleteAudio()"
        >删除录音</el-button
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Media, MediaFile } from 'sys-types'
import { FileUtil } from 'sys-types'

interface Props {
  modelValue: Media[]
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: '178px'
})
const emits = defineEmits<{
  'update:modelValue': [list: Media[]]
}>()
const uploadMode = ref(1) // 上传的类型，1--未定，2--图片，3--视频, 4--音频
const lockUploadMode = ref(false) // 不能选择其他上传类型
const uploading = ref(false)
const audioRecorderRef = ref()
const audioRecordFile = shallowRef<File>()
const inputRef = ref<HTMLInputElement>()
const failedFileList = shallowRef<File[]>([])
const config = useRuntimeConfig()
const { handleUploadSingle, handlePartUpload, handleCheckFile } =
  useUploadFile()

const coverFile = computed<MediaFile>(() => {
  if ([3, 4].includes(uploadMode.value) && props.modelValue.length)
    return props.modelValue[0]?.cover
})

const acceptType = computed(() => {
  const imageType = config.public.imageType
  const videoType = config.public.videoType
  const audioType = config.public.audioType
  switch (uploadMode.value) {
    case 1:
      return [imageType, videoType, audioType].join()
    case 2:
      return imageType
    case 3:
      return videoType
    case 4:
      return audioType
  }
})

function handleSelectUploadType(type: number) {
  // 已锁定就不能上传其他类型
  if (lockUploadMode.value && uploadMode.value !== type) return

  // 视频和音频只能上传一个
  if ([3, 4].includes(uploadMode.value) && props.modelValue.length) return

  uploadMode.value = type

  if (type !== 4) {
    audioRecordFile.value = undefined
    nextTick(() => {
      inputRef.value?.click()
    })
  }
}

function handleCheckUploadValid(file: File): boolean {
  const ext = getFileExt(file.name)

  return acceptType.value.includes(ext)
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
  failedFileList.value = []
  await Promise.all(uploadList)
  uploading.value = false
  inputRef.value.value = ''
}

async function handleAudioRecordComplete(f: File | undefined) {
  handleClearAllFile()
  audioRecordFile.value = f
}

async function handleUploadAudio() {
  failedFileList.value = []
  uploading.value = true
  const success = await handleUploadFile(audioRecordFile.value, 'audio')
  uploading.value = false
  if (success) {
    audioRecordFile.value = undefined
  }
}

async function handleUploadFile(file: File, type?: string): Promise<boolean> {
  if (!handleCheckUploadValid(file)) {
    message.error('不支持的文件类型')
    return false
  }
  const fileUtil = new FileUtil(file)
  await fileUtil.init()
  let mediaFile
  try {
    const oldFile = await handleCheckFile(fileUtil)

    if (oldFile) {
      mediaFile = oldFile
    } else if (fileUtil.isSplit) {
      mediaFile = await handlePartUpload(fileUtil, type)
    } else {
      mediaFile = await handleUploadSingle({ file, type })
    }
    if (mediaFile) {
      lockUploadMode.value = true
      emits('update:modelValue', [
        ...props.modelValue,
        { fileId: mediaFile.id, file: mediaFile }
      ])
      return true
    } else {
      // failedFileList.value.push(file)
      return false
    }
  } catch (e) {
    // failedFileList.value.push(file)
    ElMessage.error('上传失败')
    return false
  }
}

function handleUploadCoverComplete(result: MediaFile) {
  emits('update:modelValue', [
    {
      ...props.modelValue[0],
      cover: result
    }
  ])
}

function getFileExt(path: string) {
  const index = path.lastIndexOf('.')
  return path.slice(index).toLowerCase()
}

function handleDeleteItem(idx: number) {
  const temp = props.modelValue.slice()
  temp.splice(idx, 1)
  if (temp.length === 0) {
    lockUploadMode.value = false
  }
  emits('update:modelValue', temp)
}

function handleDeleteAudio() {
  audioRecorderRef.value?.handleClearAudio()
  handleDeleteItem(0)
}

function handleClearAllFile() {
  emits('update:modelValue', [])
}
</script>

<style lang="postcss" scoped>
.limit-size {
  width: v-bind('props.size');
  height: v-bind('props.size');
}
img,
video {
  @apply h-full w-full;
}
</style>
