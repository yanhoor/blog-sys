const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async (ctx, next) => {
  const {id} = ctx.request.body
  try {
    const result = await prisma.followGroup.findUnique({
      where: {
        id
      },
    })

    return ctx.body = {
      success: true,
      result
    }
  } catch (e) {
    this.errorLogger.error('followGroup.info--------->', e)
  }
}
