import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export function formatTime(value: string, format = 'YYYY-MM-DD HH:mm') {
  const t = new Date(value)
  const d = dayjs().diff(dayjs(t), 'day')
  if (d < 366) {
    return dayjs(t).format('MM-DD HH:mm')
  }
  return dayjs(t).format(format)
}

export function toAliasTime(value: string): string {
  const t = new Date(value)
  const sec = dayjs().diff(dayjs(t), 'second')
  if (sec < 30) {
    return '刚刚'
  }
  if (sec < 60) {
    return sec + '秒前'
  }
  const min = dayjs().diff(dayjs(t), 'minute')
  if (min < 60) {
    return min + '分钟前'
  }
  const h = dayjs().diff(dayjs(t), 'hour')
  if (h < 24) {
    return h + '小时前'
  }
  const yesterday = dayjs().subtract(1, 'd')
  const isYesterday = dayjs().isSame(yesterday, 'day')
  if (h >= 24 && isYesterday) {
    return '昨天 ' + dayjs(t).format('HH:mm')
  }
  const isSame = dayjs().isSame(dayjs(t), 'year')
  if (isSame) {
    return dayjs(t).format('MM-DD HH:mm')
  }
  return dayjs(t).format('YYYY-MM-DD HH:mm')
}

export function formatDuration(duration?: number | string): string {
  const dur = dayjs.duration(Number(duration || 0), 's')
  const min = dur.minutes()
  const sec = dur.seconds()
  return min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0')
}
