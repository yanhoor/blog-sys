import { Media } from 'sys-types'
import $http, { user_media_list } from '@/http'
import { useEffect, useRef, useState } from 'react'
import MediaImageItem from '@/components/media/media-image-item'
import { useNavigate } from 'react-router-dom'
import MediaDetailView from '@/components/media/media-detail-view'

interface Props {
  userId: string
}

export default function UserImageWall({ userId }: Props) {
  const navigate = useNavigate()
  const [imageList, setImageList] = useState<Media[]>([])
  const [imageTotal, setImageTotal] = useState(0)
  const [showMediaDetail, setShowMediaDetail] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number>(-1)

  useEffect(() => {
    getImageList()
  }, [])

  async function getImageList() {
    try {
      const { msg, success, result } = await $http.post(user_media_list, {
        userId: userId,
        type: 1
      })
      if (success) {
        setImageList(result.list)
        setImageTotal(result.total)
      } else {
        // setErrorMsg(msg || '获取用户信息失败')
        // Toast.fail(msg || '获取用户信息失败')
      }
    } catch (e) {
      // Toast.fail('获取用户信息失败')
      console.log('=====getUserInfo error======', e)
    }
  }

  function handlePreviewImage(index: number) {
    // const base: string = import.meta.env.VITE_IMAGE_BASE
    // ImagePreview.open({
    //   images: imageList.map((image) => base + image.file.url),
    //   startPosition: index
    // })
    setPreviewIndex(index)
    setShowMediaDetail(true)
  }

  return imageList.length ? (
    <div className="image-section">
      <div className="mx-[5px] flex items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <span className="secondary-text text-[14px]">相册</span>
          <span className="regular-text text-[16px] font-semibold">
            {imageTotal}
          </span>
        </div>
        <span
          className="text-[14px]"
          onClick={() => {
            navigate('/userAlbum/' + userId)
          }}
        >
          全部
        </span>
      </div>
      <div className="w-full">
        <div className="flex overflow-auto">
          {imageList.map((media, index) => (
            <div className="float-left w-1/5 shrink-0" key={media.id}>
              <div className="relative h-0 w-full pt-[100%]">
                <MediaImageItem
                  className="absolute top-0 h-full w-full overflow-clip object-cover"
                  url={media.file.url}
                  enablePreview={false}
                  quality={60}
                  onClick={() => handlePreviewImage(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {previewIndex > -1 ? (
        <MediaDetailView
          key={previewIndex}
          mediaList={imageList}
          initIndex={previewIndex}
          visible={showMediaDetail}
          onChangeVisible={() => setShowMediaDetail(false)}
        />
      ) : null}
    </div>
  ) : null
}
