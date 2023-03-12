const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
  } catch (e) {
    return ctx.body = {
      code: this.CODE.USER_NOT_LOGIN,
      success: false,
      msg: e.message
    }
  }
  const filter = { receiveUserId: userId }
  try {
    const [total, unreadTotal, unreadComment, unreadLike, unreadCollect, unreadAudit] = await prisma.$transaction([
      prisma.notification.count({where: filter}),
      prisma.notification.count({where: { ...filter, isRead: 0 }}),
      prisma.notification.count({where: { ...filter, isRead: 0, OR: [{ type: 'comment' }, { type: 'comment_reply' }] }}),
      prisma.notification.count({where: { ...filter, isRead: 0, type: 'like_blog' }}),
      prisma.notification.count({where: { ...filter, isRead: 0, type: 'collect_blog' }}),
      prisma.notification.count({where: { ...filter, isRead: 0, type: 'system_audit' }}),
    ])

    return ctx.body = {
      success: true,
      result: {
        total,
        unreadTotal,
        unreadComment,
        unreadLike,
        unreadCollect,
        unreadAudit,
      }
    }
  }catch (e) {
    this.errorLogger.error('notification.count--------->', e)
  }
}
