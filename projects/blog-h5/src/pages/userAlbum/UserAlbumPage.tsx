import { useParams } from 'react-router-dom'
import { ReactNode, useRef, useState } from 'react'
import { Media } from 'sys-types'
import AppendListWrapper from '@/components/append-list-wrapper'
import { user_media_list } from '@/http'
import MediaImageItem from '@/components/media/media-image-item'
import MediaDetailView from '@/components/media/media-detail-view'
import PageWrapper from '@/components/page-wrapper'
import CustomNavBar from '@/components/custom/custom-nav-bar'

export default function UserAlbumPage() {
  const params = useParams()
  const [itemTotal, setItemTotal] = useState(0)
  const [imageList, setImageList] = useState<Media[]>([])
  const [showMediaDetail, setShowMediaDetail] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number>(-1)

  function handlePreviewImage(index: number) {
    // const base: string = import.meta.env.VITE_IMAGE_BASE
    // ImagePreview.open({
    //   images: imageList.map((image) => base + image.file.url),
    //   startPosition: index
    // })
    // console.log('==========handlePreviewImage==========', index)
    setPreviewIndex(index)
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
                onClick={() => handlePreviewImage(index)}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <PageWrapper title="用户相册">
      <CustomNavBar title={`用户相册(${itemTotal})`} />
      <div className="user-album">
        <AppendListWrapper
          url={user_media_list}
          createList={createViewList}
          initParams={{ type: 1, userId: params.uid }}
          onFetchComplete={(result) => {
            setItemTotal(result.total)
          }}
          onListUpdate={(list: Media[]) => setImageList(list)}
        />
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
    </PageWrapper>
  )
}
