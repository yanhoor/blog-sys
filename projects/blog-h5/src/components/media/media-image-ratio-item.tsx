import MediaImageItem from '@/components/media/media-image-item'

interface Props {
  url: string
  className?: string
  onClick?: () => void
}

export default function MediaImageRatioItem({
  url,
  className = '',
  onClick
}: Props) {
  return (
    <div className={`relative h-0 w-full rounded-[3px] ${className}`}>
      <MediaImageItem
        className="absolute top-0 h-full w-full overflow-clip object-cover"
        style={{ borderRadius: 'inherit' }}
        url={url}
        quality={60}
        onClick={onClick}
        enablePreview={false}
      />
    </div>
  )
}
