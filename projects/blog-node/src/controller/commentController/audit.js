const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const { mySocketIo, SOCKETEVENTTYPE } = require('../../socketIo')

module.exports = async function (ctx, next) {
  let { id, auditTip, type } = ctx.request.body
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
    const comment = await prisma.comment.update({
      where: {
        id
      },
      data: {
        auditById: userId,
        auditStatus: type,
        status: type === 1 ? 2 : 3,
        auditTip: auditTip || null,
        auditedAt: new Date()
      },
      select: {
        id: true,
        createById: true,
        content: true,
        createdAt: true,
        blogId: true,
        auditStatus: true,
        auditTip: true
      }
    })
    const nd = {
      createById: userId,
      receiveUserId: comment.createById,
      type: this.NOTIFICATION_TYPE.system_audit,
      blogId: comment.blogId,
      commentId: comment.id,
      content: {
        auditStatusText: comment.auditStatus === 1 ? '审核通过' : '审核不通过',
        auditTip: comment.auditTip
      }
    }
    const notification = await prisma.notification.create({
      data: nd,
      select: {
        id: true,
        createdAt: true,
        content: true,
        isRead: true,
        type: true,
        createById: true,
        blogId: true,
        commentId: true,
        comment: {
          select: {
            id: true,
            content: true
          }
        }
      }
    })
    mySocketIo.ioInstance
      .to(comment.createById.toString())
      .emit(SOCKETEVENTTYPE.notification, notification)

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('comment.audit--------->', e)
  }
}
