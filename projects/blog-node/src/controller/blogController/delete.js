const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  const { id } = ctx.request.body
  try {
    await prisma.$transaction([
      prisma.blog.update({
        where: {
          id: Number(id)
        },
        data: {
          deletedAt: new Date()
        }
      }),
      prisma.media.updateMany({
        where: {
          blogId: Number(id)
        },
        data: {
          deletedAt: new Date()
        }
      }),
      prisma.comment.updateMany({
        where: {
          blogId: Number(id)
        },
        data: {
          deletedAt: new Date()
        }
      })
    ])

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('blog.delete--------->', e)
  }
}
