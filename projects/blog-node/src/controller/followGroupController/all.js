const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function(ctx, next) {
  try {
    let userId = await this.getAuthUserId(ctx, next)
    if(!userId){
      return ctx.body = {
        success: false,
        code: this.CODE.USER_NOT_LOGIN,
        msg: '未登录'
      }
    }
    const xprisma = prisma.$extends({
      result: {
        followGroup: {
          // 在返回的结果新增自定义字段
          memberCount: {
            // 计算这个新字段值需要依赖的真实字段
            needs: { containUsers: true },
            compute(item) {
              // 计算获取这个新字段值的逻辑，即从何处来
              return item.containUsers.length
            },
          },
        }
      }
    })
    const result = await xprisma.followGroup.findMany({
      where: {
        createById: userId
      },
      select: {
        id: true,
        name: true,
        system: true,
        memberCount: true
      },
      orderBy: [
        {system: 'asc'},
        {sort: 'asc'},
        {updatedAt: 'desc'},
      ]
    })

    return ctx.body = {
      success: true,
      result
    }
  } catch (e) {
    this.errorLogger.error('followGroup.all--------->', e)
  }
}
