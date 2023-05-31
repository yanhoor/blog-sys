import TimeUtils from '@/utils/timeUtils'

interface Props {
  time: string
  isAlias?: boolean
}
export default function YTime({ time, isAlias = true }: Props) {
  return (
    <span className="secondary-text text-[12px]">
      {isAlias ? TimeUtils.toAliasTime(time) : TimeUtils.formatTime(time)}
    </span>
  )
}
