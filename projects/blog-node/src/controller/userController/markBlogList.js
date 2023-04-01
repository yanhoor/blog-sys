const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  // type: 1--点赞，2--收藏
  const { type, page = 1, pageSize = this.pageSize } = ctx.request.body
  try {
    if (!type) throw new Error('缺少参数')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }
  let userId = await this.getAuthUserId(ctx, next)
  const skip = pageSize * (page - 1)
  let filter = {
    userId,
    ALL_DATA: true
  }
  try {
    const xprisma = prisma.$extends({
      result: {
        blog: {
          // 在返回的结果新增自定义字段
          commentsCount: {
            // 计算这个新字段值需要依赖的真实字段
            needs: { comments: true },
            compute(blog) {
              // 计算获取这个新字段值的逻辑，即从何处来
              const list = blog.comments.filter(
                (item) => !item.replyCommentId && !item.deletedAt
              )
              return list.length
            }
          },
          likedByCount: {
            needs: { likedBy: true },
            compute(blog) {
              return blog.likedBy.length
            }
          },
          isLike: {
            needs: { likedBy: true },
            compute(blog) {
              return blog.likedBy.some((item) => item.userId == userId)
            }
          },
          collectedByCount: {
            needs: { collectedBy: true },
            compute(blog) {
              return blog.collectedBy.length
            }
          },
          isCollect: {
            needs: { collectedBy: true },
            compute(blog) {
              return blog.collectedBy.some((item) => item.userId == userId)
            }
          }
        }
      }
    })

    let refList = [],
      total = 0

    if (Number(type) === 1) {
      ;[refList, total] = await prisma.$transaction([
        xprisma.LikeBlogRelation.findMany({
          skip,
          take: pageSize,
          where: JSON.parse(JSON.stringify(filter)),
          select: {
            userId: true,
            blogId: true
          },
          orderBy: {
            assignedAt: 'desc'
          }
        }),
        prisma.LikeBlogRelation.count({ where: filter })
      ])
    }

    if (Number(type) === 2) {
      ;[refList, total] = await prisma.$transaction([
        xprisma.userCollectBlogs.findMany({
          skip,
          take: pageSize,
          where: JSON.parse(JSON.stringify(filter)),
          select: {
            userId: true,
            blogId: true
          },
          orderBy: {
            assignedAt: 'desc'
          }
        }),
        prisma.userCollectBlogs.count({ where: filter })
      ])
    }

    const list = await xprisma.blog.findMany({
      where: {
        id: {
          in: refList.map((ref) => ref.blogId)
        }
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        createById: true,
        status: true,
        likedByCount: true,
        collectedByCount: true,
        commentsCount: true,
        isLike: true,
        isCollect: true,
        content: true,
        address: true,
        addressName: true,
        latitude: true,
        longitude: true,
        createBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        medias: {
          where: {
            deletedAt: null
          },
          select: {
            id: true,
            url: true
          }
        }
      }
    })

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('user.markBlogList--------->', e)
  }
}
