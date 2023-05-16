const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  let { id } = ctx.request.body
  id = Number(id)
  // let userId = await this.getAuthUserId(ctx, next)

  try {
    const media = await prisma.media.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        createdAt: true,
        deletedAt: true,
        createById: true,
        createBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        blogId: true,
        blog: {
          select: {
            id: true,
            content: true,
            createById: true,
            createdAt: true,
            deletedAt: true
          }
        },
        fileId: true,
        file: {
          select: {
            id: true,
            md5: true,
            url: true,
            type: true
          }
        }
      }
    })

    if (!media || media.deletedAt) {
      return (ctx.body = {
        success: false,
        msg: '资源不存在'
      })
    } else {
      return (ctx.body = {
        success: true,
        result: media
      })
    }
  } catch (e) {
    this.errorLogger.error('media.info--------->', e)
  }
}
