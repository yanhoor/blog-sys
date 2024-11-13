import MediaImageItem from '@/components/media/media-image-item'
import { PlayCircle } from '@react-vant/icons'
import React, { useRef, useState, useEffect } from 'react'

interface Props {
  url: string
  coverUrl?: string
}

export default function MediaVideoItem({ url, coverUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function playVideo(e: any) {
    console.log('==================')
    e.stopPropagation()
    videoRef.current?.play()
    setIsPlaying(true)
  }

  const base: string = import.meta.env.VITE_IMAGE_BASE
  return (
    <div className="media-video-item h-full w-full">
      <div
        className="relative h-0 w-full bg-black"
        style={{ paddingTop: 'calc(100% * 9 / 16)' }}
      >
        <video
          className="absolute top-0 h-full w-full"
          controls
          preload="auto"
          src={base + url}
          ref={videoRef}
        ></video>
        {coverUrl && !isPlaying && (
          <div onClick={playVideo}>
            <MediaImageItem
              url={coverUrl}
              quality={60}
              className="absolute top-0 h-full w-full overflow-clip object-cover"
            />
            <PlayCircle
              className="z-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              color="#fff"
              fontSize="56px"
            />
          </div>
        )}
      </div>
    </div>
  )
}
