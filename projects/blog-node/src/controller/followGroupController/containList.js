const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { userId } = ctx.request.body
  let curUserId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('参数不全')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const result = await prisma.followGroup.findMany({
      where: {
        createById: curUserId,
        containUsers: {
          some: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    return (ctx.body = {
      success: true,
      result
    })
  } catch (e) {
    this.errorLogger.error('followGroup.containList--------->', e)
  }
}
