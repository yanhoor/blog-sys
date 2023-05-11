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
  trigger?: ReactNode
  preview?: ReactNode
  onComplete: (url: string, file?: MediaFile) => void
}

export default function UploadImg({
  url,
  trigger,
  preview,
  onComplete
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showAction, setShowAction] = useState(false)
  const actionList: ActionSheetAction[] = [
    { name: '预览' },
    { name: '删除', color: '#ef4444' }
  ]

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    // console.log('=========handleUpload=========', e.target.files)
    if (!e.target.files) return

    const file: File = e.target.files[0]
    try {
      const { msg, success, result } = await $http.post(
        upload,
        {
          file: file
        },
        true
      )
      if (success) {
        onComplete(result.url, result)
        console.log('================', result)
      } else {
        Toast.fail(msg || '上传失败')
      }
    } catch (e) {
      Toast.fail('上传失败')
      console.log('=====handleUpload error======', e)
    }
  }

  function handleActionSelect(action: ActionSheetAction, index: number) {
    switch (index) {
      case 0:
        const base: string = import.meta.env.VITE_IMAGE_BASE
        ImagePreview.open({
          showIndex: false,
          images: [base + url]
        })
        break
      case 1:
        onComplete('', undefined)
        break
    }
  }

  return url ? (
    <div onClick={() => setShowAction(true)}>
      {preview ?? (
        <MediaImageItem url={url} quality={60} enablePreview={false} />
      )}
      <ActionSheet
        visible={showAction}
        actions={actionList}
        onSelect={handleActionSelect}
      />
    </div>
  ) : (
    <div onClick={() => inputRef.current?.click()}>
      {trigger ?? <Upgrade fontSize="24px" className="text-green-700" />}
      <input
        className="hidden"
        type="file"
        accept={MyConfig.IMAGE_TYPE}
        ref={inputRef}
        onChange={handleUpload}
      />
    </div>
  )
}
