import TimeUtils from '@/utils/timeUtils'

interface Props {
  time: string
  isAlias?: boolean
}
export default function YTime({ time, isAlias = true }: Props) {
  return (
    <span className="text-[12px] text-gray-500">
      {isAlias ? TimeUtils.toAliasTime(time) : TimeUtils.formatTime(time)}
    </span>
  )
}
