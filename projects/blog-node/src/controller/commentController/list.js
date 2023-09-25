const prisma = require('../../database/prisma')
const { commentFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  const {
    page = 1,
    pageSize = this.pageSize,
    blogId,
    sort = 2
  } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  const filter = {
    blogId,
    topCommentId: null,
    status: {
      notIn: [3, 4]
    }
  }
  let orderBy = { createdAt: 'desc' }
  switch (sort) {
    case 1:
      orderBy = { createdAt: 'desc' }
      break
    case 2:
      orderBy = [
        { likedBy: { _count: 'desc' } },
        { childComments: { _count: 'desc' } },
        { createdAt: 'desc' }
      ]
      break
  }
  try {
    const xprisma = prisma.$extends({
      result: {
        comment: {
          // childCommentsCount: {
          //   // 计算这个新字段值需要依赖的真实字段
          //   needs: { childComments: true },
          //   compute(comment) {
          //     // 计算获取这个新字段值的逻辑，即从何处来
          //     const list = comment.childComments.filter((c) => !c.deletedAt)
          //     return list.length
          //   }
          // },
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
    const [list, total] = await prisma.$transaction([
      // todo: 为毛用了 xprisma 下面的 childComments select 就无效
      xprisma.comment.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          isLike: true,
          likedByCount: true,
          ...commentFieldExpose.select,
          // childCommentsCount: true, // 会使 childComments select 无效
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
            }
          },
          childComments: {
            take: 2,
            where: {
              deletedAt: null,
              status: {
                notIn: [3, 4]
              }
            },
            // 可以用include
            select: commentFieldExpose.select
          }
        },
        orderBy
      }),
      prisma.comment.count({ where: filter })
    ])

    list.forEach((item) => {
      item.childCommentsCount = item._count.childComments
      delete item._count
    })

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('comment.list--------->', e)
  }
}
