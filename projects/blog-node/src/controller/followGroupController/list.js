const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { name, page = 1, pageSize = this.pageSize } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  const filter = { createById: userId }
  if (name) filter.name = { contains: name }
  try {
    const [list, total] = await prisma.$transaction([
      prisma.followGroup.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          system: true,
          name: true
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.followGroup.count({ where: filter })
    ])

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('followGroup.list--------->', e)
  }
}
