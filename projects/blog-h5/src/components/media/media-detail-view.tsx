import { ActionSheet, ImagePreview, Swiper, Toast } from 'react-vant'
import { Media } from 'sys-types'
import MediaImageItem from '@/components/media/media-image-item'
import ExpandableContent from '@/components/expandable-content'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface Props {
  mediaList: Media[]
  initIndex?: number
  visible: boolean
  onChangeVisible: () => void
}

export default function MediaDetailView({
  mediaList,
  initIndex = 0,
  visible,
  onChangeVisible
}: Props) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(initIndex)

  function toPostDetail(media: Media) {
    navigate('/post/' + media.blogId)
  }

  function handlePreviewImage(index: number) {
    const base: string = import.meta.env.VITE_IMAGE_BASE
    ImagePreview.open({
      images: mediaList.map((image) => base + image.file.url),
      startPosition: index
    })
  }

  return (
    <div className="media-detail-view">
      <ActionSheet
        style={{
          '--rv-action-sheet-max-height': '30%'
        }}
        visible={visible}
        round={false}
        onClickOverlay={onChangeVisible}
      >
        <div className="bg-black">
          <Swiper
            initialSwipe={initIndex}
            loop={false}
            indicator={false}
            onChange={(index) => setCurrentIndex(index)}
          >
            {mediaList.map((media, index) => (
              <Swiper.Item
                key={media.id}
                style={{ display: currentIndex === index ? 'block' : 'none' }}
              >
                <MediaImageItem
                  className="w-full overflow-clip object-cover"
                  url={media.file.url}
                  quality={60}
                  enablePreview={false}
                  onClick={() => handlePreviewImage(index)}
                />
                <div className="p-[6px]" onClick={() => toPostDetail(media)}>
                  <ExpandableContent
                    className="text-white"
                    content={media.blog.content}
                    expandText="全文"
                    maxLength={40}
                    onClickExpand={() => toPostDetail(media)}
                  />
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        </div>
      </ActionSheet>
    </div>
  )
}
