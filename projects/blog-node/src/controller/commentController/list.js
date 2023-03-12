const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function(ctx, next) {
  const {page = 1, pageSize = this.pageSize, blogId, sort = 1} = ctx.request.body
  const skip = pageSize * (page - 1)
  const filter = {
    blogId: Number(blogId),
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
      orderBy = { childComments: { _count: 'desc' } }
      break
  }
  try {
    const xprisma = prisma.$extends({
      result: {
        comment: {
          childCommentsCount: {
            // 计算这个新字段值需要依赖的真实字段
            needs: { childComments: true },
            compute(comment) {
              // 计算获取这个新字段值的逻辑，即从何处来
              const list = comment.childComments.filter(c => !c.deletedAt)
              return list.length
            },
          }
        }
      }
    })
    const [list, total] = await prisma.$transaction([
      // todo: 为毛用了 xprisma 下面的 childComments select 就无效
      prisma.comment.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          createdAt: true,
          content: true,
          blogId: true,
          topCommentId: true,
          createById: true,
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
                },
              }
            }, // 这个数量错误，包含了已删除的
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
            select: {
              id: true,
              createdAt: true,
              content: true,
              blogId: true,
              topCommentId: true,
              replyCommentId: true,
              createById: true,
              createBy: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                }
              },
              replyTo: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                }
              },
              replyComment: {
                select: {
                  id: true,
                  createdAt: true,
                  content: true,
                  blogId: true,
                  topCommentId: true,
                  deletedAt: true,
                  createById: true,
                  createBy: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true,
                    }
                  },
                  replyTo: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true,
                    }
                  },
                }
              }
            }
          },
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          replyTo: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        },
        orderBy
      }),
      prisma.comment.count({where: filter})
    ])

    list.forEach(item => {
      item.childCommentsCount = item._count.childComments
      delete item._count
    })

    return ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    }
  } catch (e) {
    this.errorLogger.error('comment.list--------->', e)
  }
}
