const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let { id, auditTip, type } = ctx.request.body
  id = Number(id)
  type = Number(type)
  try {
    if (!id) throw new Error('id不能为空')
    if (type === 2 && !auditTip) throw new Error('审核意见不能为空')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }
  try {
    let userId = await this.getAuthUserId(ctx, next)
    const blog = await prisma.blog.update({
      where: {
        id
      },
      data: {
        auditById: userId,
        auditStatus: type === 1 ? 1 : 2,
        status: type === 1 ? 2 : 3,
        auditTip: auditTip || null,
        auditedAt: new Date()
      }
    })

    const nd = {
      createById: Number(userId),
      receiveUserId: blog.createById,
      type: this.NOTIFICATION_TYPE.system_audit,
      blogId: blog.id,
      content: {
        auditStatusText: blog.auditStatus === 1 ? '审核通过' : '审核不通过',
        auditTip: blog.auditTip
      }
    }
    const notification = await prisma.notification.create({
      data: nd
    })
    this.websocket.sendWsMessage(
      blog.createById,
      JSON.stringify({
        type: this.WEBSOCKET_MESSAGE_TYPE.notification,
        id: notification.id
      })
    )

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('blog.audit--------->', e)
  }
}
