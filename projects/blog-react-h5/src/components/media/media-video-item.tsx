import MediaImageItem from '@/components/media/media-image-item'
import { PlayCircle } from '@react-vant/icons'
import React, { useRef } from 'react'
import { useState, useEffect } from 'react'

interface Props {
  url: string
  coverUrl?: string
}

export default function MediaVideoItem({ url, coverUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function playVideo() {
    console.log('==================')
    videoRef.current?.play()
    setIsPlaying(true)
  }

  const base: string = import.meta.env.VITE_IMAGE_BASE
  return (
    <div className="media-video-item w-full h-full">
      <div
        className="relative w-full h-0 bg-black"
        style={{ paddingTop: 'calc(100% * 9 / 16)' }}
      >
        <video
          className="absolute w-full h-full top-0"
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
              className="absolute object-cover overflow-clip top-0 w-full h-full"
            />
            <PlayCircle
              className="z-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              color="#fff"
              fontSize="56px"
            />
          </div>
        )}
      </div>
    </div>
  )
}
