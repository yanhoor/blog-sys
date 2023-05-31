import MediaImageItem from '@/components/media/media-image-item'
import { PlayCircle, PauseCircle, Replay, Play, Pause } from '@react-vant/icons'
import React, { useRef } from 'react'
import { useState } from 'react'
import { PlayState, timeUtils } from 'sys-types'

interface Props {
  url: string
  coverUrl?: string
}

export default function MediaAudioItem({ url, coverUrl }: Props) {
  const [playState, setPlayState] = useState<PlayState>(PlayState.idle)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  function playVideo(e: any) {
    e.stopPropagation()
    if (playState === PlayState.playing) {
      audioRef.current?.pause()
      setPlayState(PlayState.paused)
    } else {
      audioRef.current?.play()
      setPlayState(PlayState.playing)
    }
  }

  const base: string = import.meta.env.VITE_IMAGE_BASE

  const player = (
    <audio
      preload="auto"
      src={base + url}
      ref={audioRef}
      onEnded={() => setPlayState(PlayState.end)}
      onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
    ></audio>
  )

  const smallPlayer = (
    <div>
      {player}
      <div className="flex items-center gap-[4px] text-gray-700 bg-gray-200 rounded-[5px] py-[5px] px-[12px]">
        <h3 className="text-start flex-1">
          {timeUtils.formatDuration(currentTime || 0)}
        </h3>
        <div>
          {playState === PlayState.playing && (
            <Pause fontSize="20px" onClick={playVideo} />
          )}
          {[PlayState.idle, PlayState.paused].includes(playState) && (
            <Play fontSize="20px" onClick={playVideo} />
          )}
          {playState === PlayState.end && (
            <Replay fontSize="20px" onClick={playVideo} />
          )}
        </div>
        <h3 className="text-end flex-1">
          {timeUtils.formatDuration(duration)}
        </h3>
      </div>
    </div>
  )

  const largePlayer = (
    <div className="media-video-item w-full h-full">
      <div
        className="relative w-full h-0 bg-black"
        style={{ paddingTop: 'calc(100% * 9 / 16)' }}
      >
        {player}

        {coverUrl && (
          <div onClick={playVideo}>
            <MediaImageItem
              url={coverUrl}
              quality={60}
              className="absolute object-cover overflow-clip top-0 w-full h-full"
            />
            <div className="z-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center">
              {playState === PlayState.playing && (
                <PauseCircle fontSize="56px" onClick={playVideo} />
              )}
              {[PlayState.idle, PlayState.paused].includes(playState) && (
                <PlayCircle fontSize="56px" onClick={playVideo} />
              )}
              {playState === PlayState.end && (
                <Replay fontSize="56px" onClick={playVideo} />
              )}
              {duration > 0 && (
                <h3 className="text-center">
                  {currentTime > 0
                    ? `${timeUtils.formatDuration(currentTime)}/`
                    : ''}
                  {timeUtils.formatDuration(duration)}
                </h3>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return coverUrl ? largePlayer : smallPlayer
}
