import { CSSProperties } from 'react'
import { ImagePreview } from 'react-vant'

interface Props {
  url: string
  className?: string
  style?: CSSProperties
  quality?: number
  enablePreview?: boolean
  onClick?: () => void
}

export default function MediaImageItem({
  url,
  quality,
  className,
  enablePreview = true,
  style,
  onClick
}: Props) {
  const base: string = import.meta.env.VITE_IMAGE_BASE
  let imgUrl = base + url
  if (quality) imgUrl += '?x-oss-process=image/resize,p_' + quality

  function handlePreviewImage() {
    if (!enablePreview) return

    const base: string = import.meta.env.VITE_IMAGE_BASE
    ImagePreview.open({
      showIndex: false,
      images: [base + url]
    })
  }

  function handleClickImage(e: any) {
    e.stopPropagation()
    if (onClick) {
      onClick()
    } else {
      handlePreviewImage()
    }
  }

  return (
    <img
      className={`media-image-item ${className}`}
      style={style}
      src={imgUrl}
      onClick={handleClickImage}
    ></img>
  )
}
