const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  let { id } = ctx.request.body
  id = Number(id)
  let userId = await this.getAuthUserId(ctx, next)

  try {
    const xprisma = prisma.$extends({
      result: {
        comment: {
          likedByCount: {
            needs: { likedBy: true },
            compute(comment) {
              return comment.likedBy.length
            }
          },
          isLike: {
            needs: { likedBy: true },
            compute(comment) {
              return comment.likedBy.some((item) => item.userId == userId)
            }
          }
        }
      }
    })

    const comment = await xprisma.comment.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        blogId: true,
        createById: true,
        likedByCount: true,
        isLike: true,
        createBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        imageId: true,
        image: {
          select: {
            id: true,
            createById: true,
            type: true,
            url: true
          }
        }
      }
    })

    if (comment) {
      return (ctx.body = {
        success: true,
        result: comment
      })
    } else {
      return (ctx.body = {
        success: false,
        msg: '评论不存在'
      })
    }
  } catch (e) {
    this.errorLogger.error('comment.info--------->', e)
  }
}
