const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const {id} = ctx.request.body
  let curUserId = await this.getAuthUserId(ctx, next)
  try {
    if (!curUserId) throw new Error('未登录')

    const group = await prisma.followGroup.findUnique({
      where: {
        id
      }
    })

    if (!group || group.createById !== curUserId) throw new Error('分组不存在')
    if(group.system === 1) throw new Error('系统分组不允许删除')
  } catch (e) {
    return ctx.body = {
      success: false,
      msg: e.message
    }
  }
  try {
    await prisma.followGroup.update({
      where: {
        id
      },
      data: {
        deletedAt: new Date()
      }
    })

    return ctx.body = {
      success: true
    }
  } catch (e) {
    this.errorLogger.error('followGroup.delete--------->', e)
  }
}
