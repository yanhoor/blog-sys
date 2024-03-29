const prisma = require('../../database/prisma')
const { FileType } = require('@prisma/client')
const { blogFieldExpose, mediaFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  try {
    const requestBody = ctx.request.body
    if (!requestBody) return (ctx.body = 500)

    let {
      keyword,
      isTopic = 0,
      topicId,
      startTime,
      endTime,
      sort,
      uid,
      gid,
      mediaType,
      isFollowing = 0,
      page = 1,
      pageSize = this.pageSize
    } = requestBody
    sort = Number(sort)
    isFollowing = Number(isFollowing) // 是否关注，1--关注，0--全部
    const skip = pageSize * (page - 1)
    const filter = {
      status: {
        notIn: [3, 4]
      }
    }
    let userId = await this.getAuthUserId(ctx, next)
    if (uid) filter.createById = uid
    if (keyword) {
      if (isTopic) {
        filter.topics = {
          some: {
            topic: {
              is: {
                content: {
                  contains: keyword
                }
              }
            }
          }
        }
      } else {
        filter.content = {
          contains: keyword
        }
      }
    }
    if (topicId) {
      filter.topics = {
        some: {
          topicId: topicId
        }
      }
    }
    filter.createdAt = {}
    if (startTime) filter.createdAt.gte = new Date(startTime)
    if (endTime) filter.createdAt.lte = new Date(endTime)
    if (mediaType && Object.values(FileType).includes(mediaType)) {
      filter.medias = {
        // 使用 every 会返回包含 medias = [] 的数据
        some: {
          file: {
            is: {
              type: mediaType
            }
          }
        }
      }
    }
    if (isFollowing) {
      filter.createBy = {
        is: {
          followers: {
            some: {
              followById: userId
            }
          }
        }
      }
    }
    let orderBy = []
    if (sort) {
      switch (sort) {
        // 综合排序
        case 1:
          orderBy.push(
            { comments: { _count: 'desc' } },
            { likedBy: { _count: 'desc' } },
            { collectedBy: { _count: 'desc' } },
            { createdAt: 'desc' }
          )
          break
        // 最新优先
        case 2:
          orderBy.push({ createdAt: 'desc' })
          break
        // 最热优先
        case 3:
          orderBy.push(
            { comments: { _count: 'desc' } },
            { likedBy: { _count: 'desc' } },
            { collectedBy: { _count: 'desc' } }
          )
          break
      }
    } else {
      orderBy.push({ createdAt: 'desc' }, { comments: { _count: 'desc' } })
    }
    if (gid && userId) {
      const group = await prisma.followGroup.findUnique({
        where: {
          id: gid
        },
        select: {
          createById: true,
          containUsers: {
            select: {
              id: true
            }
          }
        }
      })
      if (group && group.createById === userId) {
        filter.createById = {
          in: group.containUsers.map((item) => item.id)
        }
      } else {
        return (ctx.body = {
          success: false,
          code: 12,
          msg: '分组不存在'
        })
      }
    }
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
          },
          retweetCount: {
            needs: { referrerBlogs: true },
            compute(blog) {
              return blog.referrerBlogs.length
            }
          }
          // referenceMedias: {
          //   needs: { referenceBlogs: true },
          //   compute(blog) {
          //     const ml = blog.referenceBlogs.map((b) => b.medias)
          //     return ml.flat(2).filter((m) => m)
          //   }
          // }
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
    this.errorLogger.error('blog.list2--------->', e)
  }
}
