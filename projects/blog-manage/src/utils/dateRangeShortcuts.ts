import dayjs from 'dayjs'

export default [
  {
    text: '昨天',
    value: () => {
      const start = dayjs().subtract(1, 'd').startOf('date').valueOf()
      const end = dayjs().startOf('date').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '上周',
    value: () => {
      const start = dayjs().subtract(1, 'w').startOf('w').valueOf()
      const end = dayjs().subtract(1, 'w').endOf('w').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '上个月',
    value: () => {
      const start = dayjs().subtract(1, 'M').startOf('M').valueOf()
      const end = dayjs().subtract(1, 'M').endOf('M').valueOf()
      return [start, end] as const
    }
  },
  {
    text: '今年',
    value: () => {
      const start = dayjs().startOf('y').valueOf()
      const end = dayjs().valueOf()
      return [start, end] as const
    }
  }
]
