const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { page = 1, pageSize = this.pageSize, topCommentId } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  const filter = {
    topCommentId: Number(topCommentId),
    status: {
      notIn: [3, 4]
    }
  }
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

    const [topComment, list, total] = await prisma.$transaction([
      xprisma.comment.findUnique({
        where: {
          id: Number(topCommentId)
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
      }),
      xprisma.comment.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          createdAt: true,
          content: true,
          blogId: true,
          topCommentId: true,
          replyCommentId: true,
          createById: true,
          likedByCount: true,
          isLike: true,
          replyComment: {
            select: {
              id: true,
              createdAt: true,
              content: true,
              blogId: true,
              topCommentId: true,
              createById: true,
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
          },
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
          },
          replyTo: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        // 评论的回复是升序，旧的在前面
        orderBy: { createdAt: 'asc' }
      }),
      prisma.comment.count({ where: filter })
    ])

    return (ctx.body = {
      success: true,
      result: {
        topComment,
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('comment.replyList--------->', e)
  }
}
