import { PhotoO, MusicO, VideoO, DeleteO } from '@react-vant/icons'
import { Button, Toast, Loading } from 'react-vant'
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react'
import $http, { upload } from '@/http'
import MyConfig from '@/config'
import { Media, MediaFile } from 'sys-types'
import MediaImageRatioItem from '@/components/media/media-image-ratio-item'
import MediaVideoItem from '@/components/media/media-video-item'
import UploadImg from '@/components/upload/uploadImg'
import MediaAudioRecord from '@/components/media/media-audio-record'

interface Props {
  onComplete: (mediaList: UploadFile[]) => void
}

// 上传的类型，1--未定，2--图片，3--视频, 4--音频
enum UploadMode {
  unknown = 1,
  image,
  video,
  audio
}

export interface UploadFile {
  fileId: number
  file: MediaFile
  cover?: MediaFile
  coverId?: number | string
  key?: number | string
}

export const UploadMulti = memo(function ({ onComplete }: Props) {
  const [uploadMode, setUploadMode] = useState<UploadMode>(UploadMode.unknown)
  const [lockUploadMode, setLockUploadMode] = useState(false) // 不能选择其他上传类型
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [acceptType, setAcceptType] = useState('')
  const [mediaList, setMediaList] = useState<UploadFile[]>([])
  const completeListRef = useRef<UploadFile[]>([])
  const [coverFile, setCoverFile] = useState<MediaFile>()
  const [audioRecordFile, setAudioRecordFile] = useState<File>()

  console.log('=======UploadMulti========')

  useEffect(() => {
    switch (uploadMode) {
      default:
      case UploadMode.image:
        setAcceptType(MyConfig.IMAGE_TYPE)
        break
      case UploadMode.video:
        setAcceptType(MyConfig.VIDEO_TYPE)
        break
      case UploadMode.audio:
        setAcceptType(MyConfig.AUDIO_TYPE)
        break
    }
  }, [uploadMode])

  function handleSelectUploadMode(mode: UploadMode) {
    if (lockUploadMode && mode != uploadMode) return

    setUploadMode(mode)

    if (mode !== UploadMode.audio) {
      setAudioRecordFile(undefined)
      // 等待 setAcceptType
      setTimeout(() => inputRef.current?.click(), 100)
    }
  }

  async function handleSelectFileChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target
    // console.log('=========handleSelectFile=========', e.target.files)
    if (!target.files) return

    const fileList: FileList = target.files

    const uploadList: Promise<any>[] = []
    for (const file of fileList) {
      uploadList.push(handleUploadFile(file))
    }
    setUploading(true)
    await Promise.all(uploadList)
    console.log('=======handleSelectFileChange========')
    onComplete(completeListRef.current)
    // completeListRef.current = []
    setUploading(false)
    inputRef.current!.value = ''
  }

  async function handleUploadAudio() {
    // failedFileList.value = []
    setUploading(true)
    const success = await handleUploadFile(audioRecordFile as File)
    onComplete(completeListRef.current)
    setUploading(false)
    if (success) {
      setAudioRecordFile(undefined)
    }
  }

  async function handleUploadFile(file: File): Promise<boolean> {
    try {
      setUploading(true)
      const { msg, success, result } = await $http.post(upload, { file }, true)
      setUploading(false)
      if (success) {
        setLockUploadMode(true)
        const newMedia = {
          fileId: result.id,
          file: result,
          key: new Date().getTime()
        }
        completeListRef.current.push(newMedia)
        setMediaList(completeListRef.current)
        return true
      } else {
        Toast.fail(msg || '上传失败')
        return false
      }
    } catch (e) {
      setUploading(false)
      Toast.fail('上传失败')
      return false
    }
  }

  function handleDeleteItem(index: number) {
    completeListRef.current.splice(index, 1)
    if (completeListRef.current.length === 0) setLockUploadMode(false)
    setMediaList(completeListRef.current)
    onComplete(completeListRef.current)
  }

  function handleUploadCoverComplete(url: string, file?: MediaFile) {
    completeListRef.current[0].cover = file
    completeListRef.current[0].coverId = file?.id
    setCoverFile(file)
  }

  return (
    <div className="upload-multi flex w-full flex-col items-center gap-[12px]">
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept={acceptType}
        multiple={uploadMode === UploadMode.image}
        onChange={handleSelectFileChange}
      />
      <div className="flex items-center justify-center gap-[6px]">
        <Button
          round
          size="small"
          type={
            lockUploadMode && uploadMode === UploadMode.image
              ? 'primary'
              : undefined
          }
          disabled={uploadMode !== UploadMode.image && lockUploadMode}
          icon={<PhotoO />}
          onClick={() => handleSelectUploadMode(2)}
        >
          图片
        </Button>
        <Button
          round
          size="small"
          type={
            lockUploadMode && uploadMode === UploadMode.video
              ? 'primary'
              : undefined
          }
          disabled={uploadMode !== UploadMode.video && lockUploadMode}
          icon={<VideoO />}
          onClick={() => handleSelectUploadMode(3)}
        >
          视频
        </Button>
        <Button
          round
          size="small"
          type={
            lockUploadMode && uploadMode === UploadMode.audio
              ? 'primary'
              : undefined
          }
          disabled={uploadMode !== UploadMode.audio && lockUploadMode}
          icon={<MusicO />}
          onClick={() => handleSelectUploadMode(4)}
        >
          录音
        </Button>
      </div>

      {uploading && <Loading type="spinner" className="!text-primary" />}

      {uploadMode === UploadMode.image && mediaList.length > 0 && (
        <div className="-ml-[4px] -mt-[4px] flex w-full flex-wrap">
          {mediaList.map((media, index) => (
            <div
              className="relative w-1/3 pl-[4px] pt-[4px]"
              key={media.key || index}
            >
              <MediaImageRatioItem className="pt-[100%]" url={media.file.url} />
              <DeleteO
                fontSize={14}
                onClick={() => handleDeleteItem(index)}
                className="absolute -right-[6px] -top-[3px] text-primary"
              />
            </div>
          ))}
        </div>
      )}

      {uploadMode === UploadMode.audio && (
        <>
          <MediaAudioRecord onComplete={(file) => setAudioRecordFile(file)} />
          {!!audioRecordFile && (
            <Button
              round
              size="small"
              type="primary"
              onClick={handleUploadAudio}
            >
              上传录音
            </Button>
          )}
        </>
      )}

      {[UploadMode.video, UploadMode.audio].includes(uploadMode) &&
        mediaList.length > 0 && (
          <>
            {uploadMode === UploadMode.video && (
              <div className="flex w-full flex-col items-center">
                <MediaVideoItem url={mediaList[0].file.url} />
              </div>
            )}
            <div className="w-full border border-dashed border-gray-300 hover:border-green-600 hover:opacity-80">
              <div className="flex aspect-video w-full flex-col justify-center">
                <UploadImg
                  className="h-full w-full"
                  url={coverFile?.url}
                  uploadTip="上传封面"
                  onComplete={handleUploadCoverComplete}
                />
              </div>
            </div>
          </>
        )}
    </div>
  )
})
