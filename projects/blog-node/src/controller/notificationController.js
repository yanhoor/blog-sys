const BaseController = require('./baseController')
const prisma = require('../database/prisma')
class NotificationController extends BaseController{
  list = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize, type, isRead} = ctx.request.body
    const skip = pageSize * (page - 1)
    let userId = await this.getAuthUserId(ctx, next)
    const filter = { receiveUserId: userId }
    if(type) {
      const typeList = type.split(',')
      filter.OR = []
      for(let t of typeList){
        filter.OR.push({
          type: this.NOTIFICATION_TYPE[t]
        })
      }
    }
    if(Number(isRead) === 0) {
      filter.isRead = isRead
    }else{
      filter.isRead = undefined
    }
    try {
      const [list, total, unreadTotal] = await prisma.$transaction([
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
            blog: {
              select: {
                id: true,
                title: true,
                content: true
              }
            },
            commentId: true,
            comment: {
              select: {
                id: true,
                content: true,
                replyComment: {
                  select: {
                    id: true,
                    createdAt: true,
                    content: true,
                    blogId: true,
                    topCommentId: true,
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
            }
          },
          orderBy: {createdAt: 'desc'}
        }),
        prisma.notification.count({where: filter}),
        prisma.notification.count({where: { ...filter, isRead: 0 }}),
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total,
          unreadTotal,
        }
      }
    } catch (e) {
      this.errorLogger.error('notification.list--------->', e)
    }
  }

  // 通知数量
  count = async (ctx, next) => {
    let userId = await this.getAuthUserId(ctx, next)
    const filter = { receiveUserId: userId }
    try {
      const [total, unreadTotal] = await prisma.$transaction([
        prisma.notification.count({where: filter}),
        prisma.notification.count({where: { ...filter, isRead: 0 }})
      ])

      return ctx.body = {
        success: true,
        result: {
          total,
          unreadTotal
        }
      }
    }catch (e) {
      this.errorLogger.error('notification.count--------->', e)
    }
  }

  info = async (ctx, next) => {
    const { id } = ctx.request.body

    try {
      const result = await prisma.notification.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          createdAt: true,
          content: true,
          isRead: true,
          type: true,
          createById: true,
          blogId: true,
          blog: {
            select: {
              id: true,
              title: true
            }
          },
          commentId: true,
          comment: {
            select: {
              id: true,
              content: true,
            }
          },
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })
      return ctx.body = {
        success: true,
        result
      }
    }catch (e) {
      this.errorLogger.error('notification.info--------->', e)
    }
  }

  read = async (ctx, next) => {
    const { id, isAll = 0 } = ctx.request.body
    let where = {}
    if(id){
      where.id = {
        in: id.toString().split(',').map(i => Number(i))
      }
    }
    if(isAll){
      where.isRead = 0
    }
    try {
      await prisma.notification.updateMany({
        where,
        data: {
          isRead: 1
        }
      })
      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('notification.read--------->', e)
    }
  }
}

module.exports = new NotificationController()
