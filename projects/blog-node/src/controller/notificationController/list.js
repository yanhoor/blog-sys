const prisma = require('../../database/prisma')
const { blogFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  const { page = 1, pageSize = this.pageSize, type, isRead } = ctx.request.body
  const skip = pageSize * (page - 1)
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
  } catch (e) {
    return (ctx.body = {
      code: this.CODE.USER_NOT_LOGIN,
      success: false,
      msg: e.message
    })
  }
  const filter = { receiveUserId: userId }
  if (type) {
    const typeList = type.split(',')
    filter.OR = []
    for (let t of typeList) {
      filter.OR.push({
        type: this.NOTIFICATION_TYPE[t]
      })
    }
  }
  if (Number(isRead) === 0 || Number(isRead) === 1) {
    filter.isRead = isRead
  } else {
    filter.isRead = undefined
  }
  try {
    let [list, total, unreadTotal] = await prisma.$transaction([
      prisma.notification.findMany({
        skip,
        take: pageSize,
        where: filter,
        select: {
          id: true,
          createdAt: true,
          createById: true,
          isRead: true,
          type: true,
          content: true,
          blogId: true,
          blog: blogFieldExpose,
          commentId: true,
          comment: {
            select: {
              id: true,
              content: true,
              imageId: true,
              image: {
                select: {
                  id: true,
                  createById: true,
                  type: true,
                  url: true
                }
              },
              replyComment: {
                select: {
                  id: true,
                  createdAt: true,
                  content: true,
                  blogId: true,
                  topCommentId: true,
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
              }
            }
          },
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where: { ...filter, isRead: undefined } }),
      prisma.notification.count({ where: { ...filter, isRead: 0 } })
    ])

    list = list.map((n) => {
      if (n.blog.deletedAt) {
        n.blog = null
      }
      return n
    })
    return (ctx.body = {
      success: true,
      result: {
        list,
        total,
        unreadTotal
      }
    })
  } catch (e) {
    this.errorLogger.error('notification.list--------->', e)
  }
}
