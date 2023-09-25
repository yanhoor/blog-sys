const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  const { page = 1, pageSize = this.pageSize, keyword } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  let orderBy = [{ blogs: { _count: 'desc' } }, { createdAt: 'desc' }]
  const where = { content: { contains: keyword } }

  try {
    if (!userId) throw new Error('未登录')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user.type !== 1) throw new Error('不是管理员')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const [list, total] = await prisma.$transaction([
      prisma.topic.findMany({
        skip,
        where,
        take: pageSize,
        select: {
          id: true,
          content: true,
          createdAt: true,
          createById: true,
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy
      }),
      prisma.topic.count({ where })
    ])

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('topic.manageList--------->', e)
  }
}
