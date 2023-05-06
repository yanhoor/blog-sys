import { CSSProperties } from 'react'

interface Props {
  url: string
  className?: string
  style?: CSSProperties
  quality?: number
}

export default function MediaImageItem({
  url,
  quality,
  className,
  style
}: Props) {
  const base: string = import.meta.env.VITE_IMAGE_BASE
  let imgUrl = base + url
  if (quality) imgUrl += '?x-oss-process=image/resize,p_' + quality
  return (
    <img
      className={`media-image-item ${className}`}
      style={style}
      src={imgUrl}
    ></img>
  )
}
