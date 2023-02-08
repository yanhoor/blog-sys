import dayjs from "dayjs"

const time = (el, binding) => {
  const t = new Date(binding.value)
  const sec = dayjs().diff(dayjs(t), 'second')
  if(sec === 0){
    return el.textContent = '刚刚'
  }
  if(sec < 60){
    return el.textContent = sec + '秒前'
  }
  const min = dayjs().diff(dayjs(t), 'minute')
  if(min < 60){
    return el.textContent = min + '分钟前'
  }
  return el.textContent = dayjs(t).format('YYYY-MM-DD HH:mm:ss')
}

export { time }
