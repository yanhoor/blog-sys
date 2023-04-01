const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { id } = ctx.request.body

  try {
    const result = await prisma.notification.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        isRead: true,
        type: true,
        createById: true,
        blogId: true,
        blog: {
          select: {
            id: true,
            content: true
          }
        },
        commentId: true,
        comment: {
          select: {
            id: true,
            content: true
          }
        },
        createBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })
    return (ctx.body = {
      success: true,
      result
    })
  } catch (e) {
    this.errorLogger.error('notification.info--------->', e)
  }
}
