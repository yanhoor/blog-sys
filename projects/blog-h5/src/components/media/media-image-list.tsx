import { Media } from 'sys-types'
import { ImagePreview } from 'react-vant'
import MediaImageRatioItem from '@/components/media/media-image-ratio-item'
import { ReactNode } from 'react'

interface Props {
  imageList: Media[]
  maxCount?: number
  showAll?: boolean
}

export default function MediaImageList({
  imageList = [],
  showAll = false,
  maxCount = 9
}: Props) {
  const renderList = showAll ? imageList : imageList.slice(0, maxCount)

  function handlePreviewImage(index: number) {
    const base: string = import.meta.env.VITE_IMAGE_BASE
    ImagePreview.open({
      images: imageList.map((image) => base + image.file.url),
      startPosition: index
    })
  }

  let content: ReactNode | null
  if (renderList.length < maxCount) {
    if (renderList.length === 0) {
      content = null
    } else if (renderList.length === 1) {
      content = (
        <div className="mt-[4px] w-full pl-[4px] pt-[4px]">
          <MediaImageRatioItem
            url={renderList[0].file.url}
            className="pt-[calc(100%*9/16)]"
            onClick={() => handlePreviewImage(0)}
          />
        </div>
      )
    } else if ([3, 5, 7].includes(renderList.length)) {
      content = (
        <>
          {renderList.slice(0, 3).map((image, index) => (
            <div className="relative w-1/3 pl-[4px] pt-[4px]" key={image.id}>
              <MediaImageRatioItem
                className="pt-[100%]"
                url={image.file.url}
                onClick={() => handlePreviewImage(index)}
              />
            </div>
          ))}
          {renderList.slice(3, renderList.length).map((image, index) => (
            <div className="relative w-1/2 pl-[4px] pt-[4px]" key={image.id}>
              <MediaImageRatioItem
                className="pt-[calc(100%*9/16)]"
                url={image.file.url}
                onClick={() => handlePreviewImage(index)}
              />
            </div>
          ))}
        </>
      )
    } else if (renderList.length % 2 === 0) {
      content = renderList.map((image, index) => (
        <div className="relative w-1/2 pl-[4px] pt-[4px]" key={image.id}>
          <MediaImageRatioItem
            className="pt-[calc(100%*9/16)]"
            url={image.file.url}
            onClick={() => handlePreviewImage(index)}
          />
        </div>
      ))
    }
  } else {
    content = renderList.map((image, index) => (
      <div className="relative w-1/3 pl-[4px] pt-[4px]" key={image.id}>
        <MediaImageRatioItem
          url={image.file.url}
          className="pt-[100%]"
          onClick={() => handlePreviewImage(index)}
        />
        {!showAll &&
        maxCount &&
        imageList.length > maxCount &&
        index === renderList.length - 1 ? (
          <div className="relative -top-[100%] h-full w-full rounded-[3px]">
            <div
              className="z-1 absolute left-0 top-0 h-full w-full bg-gray-500 opacity-70"
              style={{ borderRadius: 'inherit' }}
            ></div>
            <span className="z-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px] font-bold text-white">
              +{imageList.length - maxCount}
            </span>
          </div>
        ) : null}
      </div>
    ))
  }

  return (
    <div className="-ml-[4px] -mt-[4px] flex w-full flex-wrap">{content}</div>
  )
}
