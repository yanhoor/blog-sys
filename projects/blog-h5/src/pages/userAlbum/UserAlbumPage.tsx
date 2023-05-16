import { useParams } from 'react-router-dom'
import { ReactNode, useRef, useState } from 'react'
import { Media } from 'sys-types'
import AppendListWrapper from '@/components/append-list-wrapper'
import { user_media_list } from '@/http'
import MediaImageItem from '@/components/media/media-image-item'
import MediaDetailView from '@/components/media/media-detail-view'

export default function UserAlbumPage() {
  const params = useParams()
  const [itemTotal, setItemTotal] = useState(0)
  const [imageList, setImageList] = useState<Media[]>([])
  const [showMediaDetail, setShowMediaDetail] = useState(false)
  const [previewMedia, setPreviewMedia] = useState<Media>()

  function handlePreviewImage(item: Media) {
    // const base: string = import.meta.env.VITE_IMAGE_BASE
    // ImagePreview.open({
    //   images: imageList.map((image) => base + image.file.url),
    //   startPosition: index
    // })
    // console.log('==========handlePreviewImage==========', index)
    setPreviewMedia(item)
    setShowMediaDetail(true)
  }

  const createViewList = (itemList: Media[]): ReactNode => {
    return (
      <div className="grid grid-cols-3">
        {itemList.map((item, index) => (
          <div className="w-full" key={item.id}>
            <div className="w-full h-0 pt-[100%] relative">
              <MediaImageItem
                className="absolute top-0 h-full w-full overflow-clip object-cover"
                url={item.file.url}
                enablePreview={false}
                quality={60}
                onClick={() => handlePreviewImage(item)}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="friend-list">
      <AppendListWrapper
        url={user_media_list}
        createList={createViewList}
        initParams={{ type: 1, userId: params.uid }}
        onFetchComplete={(result) => {
          setItemTotal(result.total)
        }}
      />
      {previewMedia ? (
        <MediaDetailView
          media={previewMedia}
          visible={showMediaDetail}
          onChangeVisible={() => setShowMediaDetail(false)}
        />
      ) : null}
    </div>
  )
}
