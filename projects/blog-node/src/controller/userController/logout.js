const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  try {
    let id = await this.getAuthUserId(ctx, next)
    await redisClient.del(this.REDIS_KEY_PREFIX.TOKEN + id)
    ctx.body = {
      success: true,
      msg: '已退出登录'
    }
  }catch (e) {
    this.errorLogger.error('user.logout--------->', e)
  }
}
