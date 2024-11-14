<template>
  <div class="media-upload-multi flex w-full flex-col items-center gap-[12px]">
    <input
      ref="inputRef"
      class="hidden"
      type="file"
      :accept="acceptType"
      :multiple="currentFileType === FileType.image"
      @change="handleSelectFileChange"
    />

    <div class="flex items-center justify-center gap-[12px]">
      <el-button
        round
        tertiary
        type="primary"
        :disabled="lockUploadMode && currentFileType !== FileType.image"
        @click="handleSelectUploadType(FileType.image)"
      >
        <template #icon>
          <Icon name="fluent:image-add-20-regular" />
        </template>
        图片
      </el-button>
      <el-button
        round
        tertiary
        type="primary"
        :disabled="lockUploadMode && currentFileType !== FileType.video"
        @click="handleSelectUploadType(FileType.video)"
      >
        <template #icon>
          <Icon name="fluent:video-add-20-regular" />
        </template>
        视频
      </el-button>
      <el-button
        round
        tertiary
        type="primary"
        :disabled="lockUploadMode && currentFileType !== FileType.audio"
        @click="handleSelectUploadType(FileType.audio)"
      >
        <template #icon>
          <Icon name="fluent:sound-wave-circle-20-regular" />
        </template>
        录音
      </el-button>
    </div>

    <MediaAudioRecord
      v-if="currentFileType === FileType.audio"
      ref="audioRecorderRef"
      @complete="handleAudioRecordComplete"
    />

    <div v-if="uploading" v-loading />

    <div
      v-if="audioRecordFile && currentFileType === FileType.audio"
      class="my-[12px] w-full text-center"
    >
      <el-button round type="primary" @click="handleUploadAudio"
        >上传录音</el-button
      >
    </div>

    <template v-if="modelValue.length">
      <div
        v-if="currentFileType === FileType.image"
        v-auto-animate
        class="flex max-h-full w-full flex-wrap gap-[12px] overflow-y-auto pt-[12px]"
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
            <Icon #icon name="fluent:delete-16-regular" />
          </el-button>
        </div>
      </div>

      <div
        v-if="[FileType.video, FileType.audio].includes(currentFileType)"
        class="relative h-0 w-full pt-[56.25%]"
      >
        <MediaUploadImg
          :model-value="coverFile?.url"
          class="absolute top-0 h-full w-full"
          width="100%"
          height="100%"
          upload-txt="点击上传封面"
          @complete="handleUploadCoverComplete"
        />
      </div>

      <div
        v-if="currentFileType === FileType.video"
        class="flex w-full flex-col items-center gap-[12px]"
      >
        <MediaVideoItem :url="modelValue[0].file.url" />
        <el-button round type="danger" @click="handleDeleteItem(0)"
          >删除视频</el-button
        >
      </div>
      <el-button
        v-if="currentFileType === FileType.audio"
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
import { FileUtil, FileType } from 'sys-types'

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
const lockUploadMode = ref(false) // 不能选择其他上传类型
const uploading = ref(false)
const audioRecorderRef = ref()
const audioRecordFile = shallowRef<File>()
const inputRef = ref<HTMLInputElement>()
const failedFileList = shallowRef<File[]>([])
const currentFileType = ref<FileType>(FileType.idle)
const config = useRuntimeConfig()
const { handleUploadSingle, handlePartUpload, handleCheckFile } =
  useUploadFile()
const { handleAliMultipartUpload } = useAliUpload()

const coverFile = computed<MediaFile>(() => {
  if (
    [FileType.video, FileType.audio].includes(currentFileType.value) &&
    props.modelValue.length
  )
    return props.modelValue[0]?.cover
})

const acceptType = computed(() => {
  const imageType = config.public.imageType
  const videoType = config.public.videoType
  const audioType = config.public.audioType
  switch (currentFileType.value) {
    case FileType.idle:
      return [imageType, videoType, audioType].join()
    case FileType.image:
      return imageType
    case FileType.video:
      return videoType
    case FileType.audio:
      return audioType
  }
})

function handleSelectUploadType(type: FileType) {
  // 已锁定就不能上传其他类型
  if (lockUploadMode.value && currentFileType.value !== type) return

  // 视频和音频只能上传一个
  if (
    [FileType.video, FileType.audio].includes(currentFileType.value) &&
    props.modelValue.length
  )
    return

  currentFileType.value = type

  if (type !== FileType.audio) {
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
  const success = await handleUploadFile(audioRecordFile.value!)
  uploading.value = false
  if (success) {
    audioRecordFile.value = undefined
  }
}

async function handleUploadFile(file: File): Promise<boolean> {
  if (!handleCheckUploadValid(file)) {
    ElMessage.error('不支持的文件类型')
    return false
  }
  const fileUtil = new FileUtil(file)
  await fileUtil.init()
  let mediaFile
  try {
    const oldFile = await handleCheckFile(fileUtil)

    if (oldFile) {
      mediaFile = oldFile
    } else {
      mediaFile = await handleAliMultipartUpload(
        fileUtil,
        currentFileType.value
      )
    }
    // else if (fileUtil.isSplit) {
    //   mediaFile = await handlePartUpload(fileUtil, currentFileType.value)
    // } else {
    //   mediaFile = await handleUploadSingle({ file, currentFileType.value })
    // }
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
