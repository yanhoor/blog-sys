const prisma = require('../../database/prisma')
const { commentFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  let { id } = ctx.request.body
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
        id
      },
      select: {
        ...commentFieldExpose.select,
        likedByCount: true,
        isLike: true,
        childComments: {
          take: 2,
          where: {
            deletedAt: null,
            status: {
              notIn: [3, 4]
            }
          },
          // 可以用include
          select: {
            ...commentFieldExpose.select
          }
        },
        _count: {
          select: {
            childComments: {
              where: {
                // topCommentId: blogId,
                deletedAt: null,
                status: {
                  notIn: [3, 4]
                }
              }
            }
          } // 这个数量错误，包含了已删除的
        }
      }
    })

    if (comment) {
      comment.childCommentsCount = comment._count.childComments
      delete comment._count
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
