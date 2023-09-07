const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  const { page = 1, pageSize = this.pageSize, keyword } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  let orderBy = [{ blogs: { _count: 'desc' } }, { createdAt: 'desc' }]
  const where = { content: { contains: keyword } }
  try {
    const [list, total] = await prisma.$transaction([
      prisma.topic.findMany({
        skip,
        where,
        take: pageSize,
        select: {
          id: true,
          content: true
        },
        orderBy
      }),
      prisma.topic.count()
    ])

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('topic.list--------->', e)
  }
}
