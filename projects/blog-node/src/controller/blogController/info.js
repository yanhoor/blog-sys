const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let { id } = ctx.request.body
  id = Number(id)
  let userId = await this.getAuthUserId(ctx, next)
  try {
    const xprisma = prisma.$extends({
      result: {
        blog: {
          // 在返回的结果新增自定义字段
          isLike: {
            // 计算这个新字段值需要依赖的真实字段
            needs: { likedBy: true },
            compute(blog) {
              // 计算获取这个新字段值的逻辑，即从何处来
              return blog.likedBy.some((item) => item.userId == userId)
            }
          },
          likedByCount: {
            needs: { likedBy: true },
            compute(blog) {
              return blog.likedBy.length
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
          },
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
          }
        }
      }
    })
    const result = await xprisma.blog.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        content: true,
        isLike: true,
        likedByCount: true,
        collectedByCount: true,
        commentsCount: true,
        isCollect: true,
        address: true,
        addressName: true,
        latitude: true,
        longitude: true,
        createById: true,
        createBy: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        topics: {
          select: {
            // offset: true,
            topicId: true,
            topic: {
              select: {
                id: true,
                content: true
              }
            }
          }
        },
        medias: {
          where: {
            deletedAt: null
          },
          select: {
            id: true,
            fileId: true,
            file: {
              select: {
                id: true,
                createById: true,
                type: true,
                url: true
              }
            },
            coverId: true,
            cover: {
              select: {
                id: true,
                createById: true,
                type: true,
                url: true
              }
            }
          }
        }
      }
    })

    if (!result || [3, 4].includes(result.status)) {
      return (ctx.body = {
        success: false,
        code: 1,
        msg: '博客不存在'
      })
    }

    const num = await redisClient.sCard(
      this.REDIS_KEY_PREFIX.READ_BLOG_USER + id
    )
    result.readCount = num

    if (userId) {
      await prisma.blog.update({
        where: { id },
        data: {
          readBy: {
            // 存在就连接，否则创建
            connectOrCreate: {
              where: {
                userId_blogId: {
                  userId,
                  blogId: id
                }
              },
              create: {
                userId
              }
            }
          }
        }
      })
      const isRead = await redisClient.sIsMember(
        this.REDIS_KEY_PREFIX.READ_BLOG_USER + id,
        userId.toString()
      )
      if (!isRead) {
        // 当前用户未读，记录阅读数
        await redisClient.zIncrBy(
          this.REDIS_KEY_PREFIX.BLOG_READ_RANKING,
          1,
          id.toString()
        )
      }
      // 记录已读用户
      await redisClient.sAdd(
        this.REDIS_KEY_PREFIX.READ_BLOG_USER + id,
        userId.toString()
      )
    }
    await redisClient.hSet(
      this.REDIS_KEY_PREFIX.EVERY_BLOG_READ_USER + result.createById,
      id,
      num
    )

    return (ctx.body = {
      success: true,
      result
    })
  } catch (e) {
    this.errorLogger.error('blog.info--------->', e)
  }
}
