import TimeUtils from '@/utils/timeUtils'

interface Props {
  time: string
}
export default function YTime({ time }: Props) {
  return (
    <span className="text-[12px] text-gray-500">
      {TimeUtils.formatTime(time)}
    </span>
  )
}
