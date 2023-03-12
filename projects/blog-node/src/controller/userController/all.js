const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  try {
    const result = await prisma.user.findMany({
      where: {
        type: 2
      },
      select: {
        id: true,
        name: true,
        mobile: true
      },
      orderBy: {createdAt: 'desc'}
    })
    ctx.body = {
      success: true,
      result
    }
  }catch (e) {
    this.errorLogger.error('user.all--------->', e)
  }
}
