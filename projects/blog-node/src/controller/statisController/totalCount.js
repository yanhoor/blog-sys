const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const dayjs = require('dayjs')

module.exports = async function (ctx, next) {
  try {
    const date = dayjs()
    const gte = new Date(date.startOf('date'))
    const lte = new Date(date.endOf('date'))
    const [
      blogCount,
      userRegisterCount,
      userActiveCount,
      userRegisterTodayCount
    ] = await prisma.$transaction([
      prisma.blog.count(),
      prisma.user.count({
        where: {
          type: 2
        }
      }),
      prisma.user.count({
        where: {
          type: 2,
          lastActiveAt: {
            gte,
            lte
          }
        }
      }),
      prisma.user.count({
        where: {
          type: 2,
          createdAt: {
            gte,
            lte
          }
        }
      })
    ])

    return (ctx.body = {
      success: true,
      result: {
        blogCount,
        userRegisterCount,
        userActiveCount,
        userRegisterTodayCount
      }
    })
  } catch (e) {
    this.errorLogger.error('statis.totalCount---------->', e)
  }
}
