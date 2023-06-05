import MediaImageItem from '@/components/media/media-image-item'
import { Toast, ActionSheet, ImagePreview } from 'react-vant'
import { Upgrade } from '@react-vant/icons'
import { ChangeEvent, ReactNode, useRef, useState } from 'react'
import $http, { upload } from '@/http'
import MyConfig from '@/config'
import { MediaFile } from 'sys-types'
import { ActionSheetAction } from 'react-vant/es/action-sheet/PropsType'

interface Props {
  url?: string
  uploadTip?: string
  className?: string
  trigger?: ReactNode
  preview?: ReactNode
  onComplete: (url: string, file?: MediaFile) => void
}

export default function UploadImg({
  url,
  uploadTip,
  className,
  trigger,
  preview,
  onComplete
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const actionList: ActionSheetAction[] = [
    { name: '预览' },
    { name: '删除', color: '#ef4444' }
  ]

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    // console.log('=========handleUpload=========', e.target.files)
    if (!e.target.files) return

    const file: File = e.target.files[0]
    setUploading(true)
    try {
      const { msg, success, result } = await $http.post(
        upload,
        {
          file: file
        },
        true
      )
      setUploading(false)
      if (success) {
        onComplete(result.url, result)
        console.log('================', result)
      } else {
        Toast.fail(msg || '上传失败')
      }
    } catch (e) {
      setUploading(false)
      Toast.fail('上传失败')
      console.log('=====handleUpload error======', e)
    }
  }

  function handleActionSelect(action: ActionSheetAction, index: number) {
    switch (index) {
      case 0:
        ImagePreview.open({
          showIndex: false,
          images: [import.meta.env.VITE_IMAGE_BASE + url]
        })
        break
      case 1:
        onComplete('', undefined)
        break
    }
  }

  return (
    <div className={`upload-img ${className || ''}`}>
      {url ? (
        <div className="h-full w-full" onClick={() => setShowAction(true)}>
          {preview ?? (
            <MediaImageItem
              className="h-full w-full overflow-clip object-cover"
              url={url}
              quality={60}
              enablePreview={false}
              stopPropagation={false}
            />
          )}
          <ActionSheet
            visible={showAction}
            actions={actionList}
            cancelText="取消"
            round={false}
            onCancel={() => setShowAction(false)}
            onSelect={handleActionSelect}
          />
        </div>
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-[4px]"
          onClick={() => inputRef.current?.click()}
        >
          {trigger ?? (
            <div className="flex flex-col items-center justify-center gap-[6px]">
              <Upgrade fontSize="32px" className="text-primary" />
              {!!uploadTip && (
                <span className="secondary-text text-[14px]">{uploadTip}</span>
              )}
            </div>
          )}
          <input
            className="hidden"
            type="file"
            accept={MyConfig.IMAGE_TYPE}
            ref={inputRef}
            onChange={handleUpload}
          />
        </div>
      )}
    </div>
  )
}
