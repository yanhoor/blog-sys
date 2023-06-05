import MediaImageItem from '@/components/media/media-image-item'
import { PlayCircle, PauseCircle, Replay, Play, Pause } from '@react-vant/icons'
import React, { useRef } from 'react'
import { useState } from 'react'
import { PlayState, timeUtils } from 'sys-types'

interface Props {
  url: string
  isAbsoluteUrl?: boolean
  coverUrl?: string
}

export default function MediaAudioItem({
  url,
  coverUrl,
  isAbsoluteUrl = false
}: Props) {
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
      src={isAbsoluteUrl ? url : base + url}
      ref={audioRef}
      onEnded={() => setPlayState(PlayState.end)}
      onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
    ></audio>
  )

  const smallPlayer = (
    <div>
      {player}
      <div className="flex w-fit items-center gap-[4px] rounded-[5px] bg-gray-200 px-[8px] py-[5px] dark:bg-gray-600">
        <div>
          {playState === PlayState.playing && (
            <Pause fontSize="18px" onClick={playVideo} />
          )}
          {[PlayState.idle, PlayState.paused].includes(playState) && (
            <Play fontSize="18px" onClick={playVideo} />
          )}
          {playState === PlayState.end && (
            <Replay fontSize="18px" onClick={playVideo} />
          )}
        </div>
        <div className="divide-x divide-gray-400 text-[12px]">
          <span className="px-[8px]">
            {timeUtils.formatDuration(currentTime || 0)}
          </span>
          <span className="px-[8px]">{timeUtils.formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  )

  const largePlayer = (
    <div className="media-video-item h-full w-full">
      <div
        className="relative h-0 w-full bg-black"
        style={{ paddingTop: 'calc(100% * 9 / 16)' }}
      >
        {player}

        {coverUrl && (
          <div onClick={playVideo}>
            <MediaImageItem
              url={coverUrl}
              quality={60}
              className="absolute top-0 h-full w-full overflow-clip object-cover"
            />
            <div className="z-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-white">
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
