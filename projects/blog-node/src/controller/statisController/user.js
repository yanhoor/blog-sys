const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let { id } = ctx.request.body
  id = Number(id)
  try {
    const u = await prisma.user.findUnique({
      where: { id }
    })
    if (!u) throw new Error('用户不存在')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const readList = await redisClient.hVals(
      this.REDIS_KEY_PREFIX.EVERY_BLOG_READ_USER + id
    )
    const readCount = readList.reduce(
      (pre, cur) => Number(pre) + Number(cur),
      0
    )

    const likeList = await redisClient.hVals(
      this.REDIS_KEY_PREFIX.EVERY_BLOG_LIKE_USER + id
    )
    const likeCount = likeList.reduce(
      (pre, cur) => Number(pre) + Number(cur),
      0
    )

    const collectList = await redisClient.hVals(
      this.REDIS_KEY_PREFIX.EVERY_BLOG_COLLECT_USER + id
    )
    const collectCount = collectList.reduce(
      (pre, cur) => Number(pre) + Number(cur),
      0
    )

    return (ctx.body = {
      success: true,
      result: {
        readCount,
        likeCount,
        collectCount
      }
    })
  } catch (e) {
    this.errorLogger.error('statis.user---------->', e)
  }
}
