const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async (ctx, next) => {
  try {
    const requestBody = ctx.request.body
    if (!requestBody) return (ctx.body = 500)

    let {
      uid,
      uname,
      keyword,
      status,
      startTime,
      endTime,
      page = 1,
      pageSize = this.pageSize
    } = ctx.request.body
    uid = Number(uid)
    status = Number(status)
    const skip = pageSize * (page - 1)
    const filter = {}

    // 作者
    if (uid) filter.createById = uid
    // 作者名
    if (uname)
      filter.createBy = {
        name: {
          contains: uname
        }
      }

    // 1--未审核
    if (status === 1) {
      filter.auditStatus = 0
    } else if (status === 2) {
      // 审核通过
      filter.auditStatus = 1
    } else if (status === 3) {
      // 审核不通过
      filter.auditStatus = 2
    } else if (status === 4) {
      // 删除
      filter.deletedAt = { not: null }
    } else {
      filter.ALL_DATA = true
    }

    // 关键词
    if (keyword)
      filter.content = {
        contains: keyword
      }

    // 创建时间
    filter.createdAt = {}
    if (startTime) filter.createdAt.gte = new Date(startTime)
    if (endTime) filter.createdAt.lte = new Date(endTime)

    const [list, total] = await prisma.$transaction([
      prisma.blog.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          createById: true,
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          status: true,
          auditStatus: true,
          auditedAt: true,
          auditTip: true,
          content: true,
          address: true,
          addressName: true,
          latitude: true,
          longitude: true,
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
        orderBy: { updatedAt: 'desc' }
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
    this.errorLogger.error('blog.manageList--------->', e)
  }
}
