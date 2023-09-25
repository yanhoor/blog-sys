const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  const { id } = ctx.request.body
  try {
    await prisma.$transaction([
      prisma.blog.update({
        where: {
          id
        },
        data: {
          deletedAt: new Date(),
          referenceBlogs: {
            set: [] // 清除转发关系，https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#disconnect-a-related-record
          }
        }
      })
      // prisma.media.updateMany({
      //   where: {
      //     blogId: id
      //   },
      //   data: {
      //     deletedAt: new Date()
      //   }
      // }),
      // prisma.comment.updateMany({
      //   where: {
      //     blogId: id
      //   },
      //   data: {
      //     deletedAt: new Date()
      //   }
      // })
    ])

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('blog.delete--------->', e)
  }
}
