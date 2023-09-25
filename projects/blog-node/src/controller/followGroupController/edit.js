const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let { name, id } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
    if (!name) throw new Error('分组名不能为空')
    if (name.length > 8) throw new Error('分组名不能超过8个字符')

    if (id) {
      const group = await prisma.followGroup.findUnique({
        where: { id }
      })

      if (!group || group.createById !== userId) throw new Error('分组不存在')
      if (group.system === 1) throw new Error('系统分组不允许修改')
    }
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  if (id) {
    try {
      const nCate = await prisma.followGroup.update({
        where: { id },
        data: {
          name
        },
        select: {
          id: true,
          name: true
        }
      })
      return (ctx.body = {
        success: true,
        result: nCate
      })
    } catch (e) {
      this.errorLogger.error('followGroup.update--------->', e)
    }
  } else {
    try {
      const group = await prisma.followGroup.findUnique({
        where: {
          name
        }
      })
      if (group && group.createById === userId) {
        return (ctx.body = {
          success: false,
          msg: '已有相同名称的分组'
        })
      }

      const nCate = await prisma.followGroup.create({
        data: {
          name,
          createById: userId
        },
        select: {
          id: true,
          name: true
        }
      })
      return (ctx.body = {
        success: true,
        result: nCate
      })
    } catch (e) {
      this.errorLogger.error('followGroup.create--------->', e)
    }
  }
}
