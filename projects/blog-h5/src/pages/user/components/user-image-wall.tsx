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
  const [previewMedia, setPreviewMedia] = useState<Media>()

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

  function handlePreviewImage(item: Media) {
    // const base: string = import.meta.env.VITE_IMAGE_BASE
    // ImagePreview.open({
    //   images: imageList.map((image) => base + image.file.url),
    //   startPosition: index
    // })
    setPreviewMedia(item)
    setShowMediaDetail(true)
  }

  return imageList.length ? (
    <div className="image-section">
      <div className="flex justify-between items-center mx-[5px]">
        <div className="flex items-center gap-[4px]">
          <span className="text-gray-500 text-[14px]">相册</span>
          <span className="font-semibold text-[16px]">{imageTotal}</span>
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
        <div className="overflow-auto flex">
          {imageList.map((media, index) => (
            <div className="w-1/5 float-left shrink-0" key={media.id}>
              <div className="relative w-full h-0 pt-[100%]">
                <MediaImageItem
                  className="absolute top-0 h-full w-full overflow-clip object-cover"
                  url={media.file.url}
                  enablePreview={false}
                  quality={60}
                  onClick={() => handlePreviewImage(media)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {previewMedia ? (
        <MediaDetailView
          media={previewMedia}
          visible={showMediaDetail}
          onChangeVisible={() => setShowMediaDetail(false)}
        />
      ) : null}
    </div>
  ) : null
}
