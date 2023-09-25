const prisma = require('../../database/prisma')
const { FileType } = require('@prisma/client')
const { blogFieldExpose, mediaFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  try {
    const requestBody = ctx.request.body
    if (!requestBody) return (ctx.body = 500)

    let { blogId, page = 1, pageSize = this.pageSize } = requestBody
    let userId = await this.getAuthUserId(ctx, next)
    const skip = pageSize * (page - 1)
    const filter = {
      referenceBlogs: {
        some: {
          id: {
            equals: blogId
          }
        }
      }
    }
    let orderBy = [
      { comments: { _count: 'desc' } },
      { likedBy: { _count: 'desc' } },
      { collectedBy: { _count: 'desc' } },
      { createdAt: 'desc' }
    ]
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
                (item) =>
                  !item.replyCommentId &&
                  !item.deletedAt &&
                  ![3, 4].includes(item.status)
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
              return blog.likedBy.some((item) => item.userId === userId)
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
              return blog.collectedBy.some((item) => item.userId === userId)
            }
          },
          retweetCount: {
            needs: { referrerBlogs: true },
            compute(blog) {
              return blog.referrerBlogs.length
            }
          }
        }
      }
    })
    const [list, total] = await prisma.$transaction([
      xprisma.blog.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          likedByCount: true,
          collectedByCount: true,
          commentsCount: true,
          retweetCount: true,
          // referenceMedias: true,
          isLike: true,
          isCollect: true,
          ...blogFieldExpose.select,
          referenceBlogs: {
            select: {
              medias: mediaFieldExpose
            }
          }
        },
        orderBy
      }),
      prisma.blog.count({ where: filter })
    ])

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('blog.retweet--------->', e)
  }
}
