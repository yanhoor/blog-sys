const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  try {
    const requestBody = ctx.request.body
    if (!requestBody) return (ctx.body = 500)

    let {
      keyword,
      startTime,
      endTime,
      sort,
      uid,
      gid,
      page = 1,
      pageSize = this.pageSize
    } = requestBody
    sort = Number(sort)
    uid = Number(uid)
    gid = Number(gid)
    const skip = pageSize * (page - 1)
    const filter = {
      status: {
        notIn: [3, 4]
      }
    }
    let userId = await this.getAuthUserId(ctx, next)
    if (uid) filter.createById = uid
    if (keyword)
      filter.OR = [
        {
          content: {
            contains: keyword
          }
        }
      ]
    filter.createdAt = {}
    if (startTime) filter.createdAt.gte = new Date(startTime)
    if (endTime) filter.createdAt.lte = new Date(endTime)
    let orderBy = []
    if (sort) {
      switch (sort) {
        // 综合排序
        case 1:
          orderBy.push(
            { createdAt: 'desc' },
            { comments: { _count: 'desc' } },
            { likedBy: { _count: 'desc' } },
            { collectedBy: { _count: 'desc' } }
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
            select: {
              id: true,
              blogId: true,
              file: {
                select: {
                  id: true,
                  createById: true,
                  url: true
                }
              }
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
