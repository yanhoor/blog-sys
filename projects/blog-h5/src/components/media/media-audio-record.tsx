import { PlayCircleO, PauseCircleO, StopCircleO } from '@react-vant/icons'
import { Toast } from 'react-vant'
import { useEffect, useRef, useState } from 'react'
import { timeUtils } from 'sys-types'
import MediaAudioItem from '@/components/media/media-audio-item'

interface Props {
  onComplete: (file: File | undefined) => void
}

enum RecordState {
  inactive = 'inactive', // inactive--未开始或开始后停止
  recording = 'recording',
  paused = 'paused'
}

export default function MediaAudioRecord({ onComplete }: Props) {
  const [recordState, setRecordState] = useState<RecordState>(
    RecordState.inactive
  )
  const [recordDuration, setRecordDuration] = useState(0)
  const [audioSrc, setAudioSrc] = useState<string>()
  const supportMimeTypeRef = useRef<string>()
  const audioExtRef = useRef<string>()
  const streamRef = useRef<MediaStream>()
  const mediaRecorderRef = useRef<MediaRecorder>()
  const recordTimerRef = useRef<number>()
  const audioChunkListRef = useRef<Blob[]>([])

  useEffect(() => {
    getSupportAudioFormat()
    return () => {
      clearDurationTimer()
      closeRecordStream()
    }
  }, [])

  async function initRecorder() {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      console.log(
        '=====initRecorder mimeType======',
        supportMimeTypeRef.current
      )
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: supportMimeTypeRef.current
      })

      // 在媒体开始录制时触发
      mediaRecorderRef.current.onstart = () => {
        setRecordState(mediaRecorderRef.current?.state as RecordState)
        setAudioSrc(undefined)
        console.log('=====mediaRecorder onstart======')
      }

      // 在媒体暂停录制时触发
      mediaRecorderRef.current.onpause = () => {
        setRecordState(mediaRecorderRef.current?.state as RecordState)
        console.log('=====mediaRecorder onpause======')
      }

      // 暂停后回复录制视频时触发
      mediaRecorderRef.current.onresume = () => {
        setRecordState(mediaRecorderRef.current?.state as RecordState)
        console.log('=====mediaRecorder onresume======')
      }

      // 在媒体录制结束时、媒体流（MediaStream）结束时、或者调用 MediaRecorder.stop() 方法后触发
      mediaRecorderRef.current.onstop = () => {
        setRecordState(mediaRecorderRef.current?.state as RecordState)
        const blob = new Blob(audioChunkListRef.current, {
          type: supportMimeTypeRef.current
        })
        audioChunkListRef.current = []
        const file = new File(
          [blob],
          `record-audio-${new Date().getTime()}.${audioExtRef.current}`,
          { type: supportMimeTypeRef.current }
        )
        onComplete(file)
        setAudioSrc(URL.createObjectURL(blob))
        console.log(
          '=====mediaRecorder onstop======',
          audioSrc,
          recordState,
          file
        )
      }

      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log('=====mediaRecorder ondataavailable======', e.data)
        audioChunkListRef.current = []
        audioChunkListRef.current.push(e.data)
      }

      mediaRecorderRef.current.onerror = () => {
        setRecordState(mediaRecorderRef.current?.state as RecordState)
        console.log('=====mediaRecorder onerror======')
      }
    } catch (e: any) {
      console.log(
        '=====handleStartRecord======',
        e.name,
        streamRef.current,
        mediaRecorderRef.current
      )
      switch (e.name) {
        case 'NotAllowedError':
          Toast.fail('录音权限被禁止，请先授权')
          break
        case 'NotFoundError':
          Toast.fail('没有可用的麦克风设备')
          break
      }
    }
  }

  async function handleStart() {
    if (recordState === RecordState.paused) {
      mediaRecorderRef.current?.resume()
      startDurationTimer()
    } else if (recordState === RecordState.inactive) {
      onComplete(undefined)
      await initRecorder()
      mediaRecorderRef.current?.start()
      startDurationTimer()
    }
  }

  async function handlePause() {
    mediaRecorderRef.current?.pause()
    clearDurationTimer()
    // closeRecordStream()
  }

  async function handleStop() {
    mediaRecorderRef.current?.stop()
    setRecordDuration(0)
    clearDurationTimer()
    closeRecordStream()
  }

  function closeRecordStream() {
    // 录制完要关闭，否则一直占用
    const tracks = mediaRecorderRef.current?.stream.getTracks()
    if (tracks && tracks.length) {
      tracks[0].stop()
    }
  }

  function startDurationTimer() {
    recordTimerRef.current = window.setInterval(() => {
      setRecordDuration((val) => val + 1)
    }, 1000)
  }

  function clearDurationTimer() {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current)
  }

  // 获取录制音频格式
  function getSupportAudioFormat() {
    const typeMap: { [key: string]: string } = {
      mp3: 'audio/mpeg', // mp3
      ogg: 'audio/ogg', // ogg
      webm: 'audio/webm', // webm
      mp4: 'audio/mp4' // mp4
    }

    for (const key of Object.keys(typeMap)) {
      const mime = typeMap[key]
      const isSupport = MediaRecorder.isTypeSupported(typeMap[key])
      console.log('=======getSupportAudioFormat=====', mime, isSupport)
      if (isSupport) {
        supportMimeTypeRef.current = mime
        audioExtRef.current = key
        break
      }
    }
  }

  return (
    <div className="media-audio-record flex w-full flex-col items-center gap-[6px] text-[12px]">
      <div className="flex items-center gap-[6px]">
        {recordState !== RecordState.recording && (
          <PlayCircleO fontSize={26} onClick={handleStart} />
        )}
        {recordState === RecordState.recording && (
          <PauseCircleO fontSize={26} onClick={handlePause} />
        )}
        {recordState !== RecordState.inactive && (
          <StopCircleO fontSize={26} onClick={handleStop} />
        )}
      </div>
      {recordState === RecordState.inactive ? (
        <span>点击录制</span>
      ) : (
        <span>录制时间：{timeUtils.formatDuration(recordDuration)}</span>
      )}
      {!!audioSrc && (
        <div className="flex items-center">
          <span>点击播放：</span>
          <MediaAudioItem url={audioSrc} isAbsoluteUrl />
        </div>
      )}
    </div>
  )
}
