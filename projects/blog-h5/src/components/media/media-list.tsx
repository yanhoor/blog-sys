import { Media, MediaFile } from 'sys-types'
import MediaImageList from '@/components/media/media-image-list'
import MediaVideoItem from '@/components/media/media-video-item'
import MediaAudioItem from '@/components/media/media-audio-item'

interface Props {
  list: Media[]
  maxCount?: number
  showAll?: boolean
}
export default function MediaList({ list = [], maxCount, showAll }: Props) {
  if (list.length === 0) return null

  const file: MediaFile = list[0].file
  const fileList: MediaFile[] = list.map((m) => m.file)

  if (file.type === 'image')
    return (
      <MediaImageList imageList={list} maxCount={maxCount} showAll={showAll} />
    )

  if (file.type === 'video')
    return <MediaVideoItem url={file.url} coverUrl={list[0].cover?.url} />

  if (file.type === 'audio')
    return <MediaAudioItem url={file.url} coverUrl={list[0].cover?.url} />

  return null
}
