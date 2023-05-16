import { MediaFile } from 'sys-types'
import MediaImageItem from '@/components/media/media-image-item'
import { ImagePreview } from 'react-vant'

interface Props {
  imageList: MediaFile[]
  maxCount?: number // 0 时全部显示
}

export default function MediaImageList({
  imageList = [],
  maxCount = 9
}: Props) {
  const renderList = maxCount ? imageList.slice(0, maxCount) : imageList

  function handlePreviewImage(index: number) {
    const base: string = import.meta.env.VITE_IMAGE_BASE
    ImagePreview.open({
      images: imageList.map((image) => base + image.url),
      startPosition: index
    })
  }

  return (
    <div className="grid grid-cols-3 gap-y-[3px] gap-x-[3px]">
      {renderList.map((image, index) => (
        <div className="w-full" key={image.id}>
          <div className="w-full h-0 pt-[100%] rounded-[3px] relative">
            <MediaImageItem
              className="absolute object-cover overflow-clip top-0 w-full h-full"
              style={{ borderRadius: 'inherit' }}
              url={image.url}
              quality={60}
              enablePreview={false}
              onClick={() => handlePreviewImage(index)}
            />
            {maxCount &&
            imageList.length > maxCount &&
            index === renderList.length - 1 ? (
              <div style={{ borderRadius: 'inherit' }}>
                <div
                  className="w-full h-full absolute top-0 left-0 bg-gray-500 z-1 opacity-70"
                  style={{ borderRadius: 'inherit' }}
                ></div>
                <span className="font-bold text-[24px] text-white z-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  +{imageList.length - maxCount}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
