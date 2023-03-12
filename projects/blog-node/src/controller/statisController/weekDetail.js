const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const dayjs = require("dayjs")

module.exports = async function (ctx, next) {
  let rangeList = []
  for(let i = 6; i >= 0; i--){
    const date = dayjs().subtract(i, 'day')
    rangeList.push({
      createdAt: this.createTimeRange(i + 1, i),
      date: dayjs(date).format('YYYY-MM-DD')
    })
  }
  try {
    let result = {}
    for (let range of rangeList){
      const [blogCount, userRegisterCount] = await prisma.$transaction([
        prisma.blog.count({
          where: {
            createdAt: range.createdAt
          }
        }),
        prisma.user.count({
          where: {
            createdAt: range.createdAt
          }
        })
      ])
      result[range.date] = {
        blogCount,
        userRegisterCount
      }
    }
    return ctx.body = {
      success: true,
      result
    }
  }catch (e) {
    this.errorLogger.error('statis.weekDetail---------->', e)
  }
}
