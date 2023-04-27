const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
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
      prisma.comment.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          auditStatus: true,
          auditTip: true,
          status: true,
          createdAt: true,
          deletedAt: true,
          auditedAt: true,
          content: true,
          blogId: true,
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
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.comment.count({ where: filter })
    ])

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('comment.manageList--------->', e)
  }
}
