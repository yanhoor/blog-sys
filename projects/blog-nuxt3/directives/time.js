import dayjs from "dayjs"

const time = (el, binding) => {
  const t = new Date(binding.value)
  const sec = dayjs().diff(dayjs(t), 'second')
  if(sec < 30){
    return el.textContent = '刚刚'
  }
  if(sec < 60){
    return el.textContent = sec + '秒前'
  }
  const min = dayjs().diff(dayjs(t), 'minute')
  if(min < 60){
    return el.textContent = min + '分钟前'
  }
  const h = dayjs().diff(dayjs(t), 'hour')
  if(h < 24){
    return el.textContent = h + '小时前'
  }
  if(h < 48){
    return el.textContent = '昨天 ' + dayjs(t).format('HH:mm')
  }
  return el.textContent = dayjs(t).format('YYYY-MM-DD HH:mm')
}

export { time }
