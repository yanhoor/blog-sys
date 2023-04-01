const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { id } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)

  try {
    if (!id) throw new Error('缺少参数: id')
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) }
    })
    if (!comment || comment.createById !== userId) throw new Error('评论不存在')
  } catch (e) {
    return (ctx.body = {
      success: false,
      msg: e.message
    })
  }

  try {
    await prisma.$transaction([
      prisma.comment.update({
        where: { id: Number(id) },
        data: {
          deletedAt: new Date(),
          status: 4
        }
      }),
      prisma.comment.updateMany({
        where: {
          OR: [{ topCommentId: Number(id) }, { replyCommentId: Number(id) }]
        },
        data: {
          deletedAt: new Date(),
          status: 4
        }
      })
    ])
    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('comment.delete--------->', e)
  }
}
