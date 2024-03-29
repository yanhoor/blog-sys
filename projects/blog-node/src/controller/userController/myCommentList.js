const prisma = require('../../database/prisma')
const { commentFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  const { page = 1, pageSize = this.pageSize } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  let filter = {
    createById: userId
  }

  try {
    const [list, total] = await prisma.$transaction([
      prisma.comment.findMany({
        skip,
        take: pageSize,
        where: filter,
        orderBy: { createdAt: 'desc' },
        select: {
          ...commentFieldExpose.select,
          blog: {
            select: {
              id: true,
              content: true,
              deletedAt: true
            }
          }
        }
      }),
      prisma.comment.count({ where: filter })
    ])

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('user.myCommentList--------->', e)
  }
}
