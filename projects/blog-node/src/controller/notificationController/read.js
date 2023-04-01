const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { id, isAll = 0, type } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
  } catch (e) {
    return (ctx.body = {
      code: this.CODE.USER_NOT_LOGIN,
      success: false,
      msg: e.message
    })
  }
  let where = {}
  if (id) {
    where.id = {
      in: id
        .toString()
        .split(',')
        .map((i) => Number(i))
    }
  }
  if (isAll) {
    where.isRead = 0
  }
  if (type) {
    const typeList = type.split(',')
    where.OR = []
    for (let t of typeList) {
      where.OR.push({
        type: this.NOTIFICATION_TYPE[t]
      })
    }
  }
  try {
    await prisma.notification.updateMany({
      where,
      data: {
        isRead: 1
      }
    })
    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('notification.read--------->', e)
  }
}
