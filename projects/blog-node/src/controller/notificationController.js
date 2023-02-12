const BaseController = require('./baseController')
const prisma = require('../database/prisma')
class NotificationController extends BaseController{
  list = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize, type, isRead} = ctx.request.body
    const skip = pageSize * (page - 1)
    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!userId) throw new Error('未登录')
    } catch (e) {
      return ctx.body = {
        code: this.CODE.USER_NOT_LOGIN,
        success: false,
        msg: e.message
      }
    }
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
    if(Number(isRead) === 0 || Number(isRead) === 1) {
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
        prisma.notification.count({where: { ...filter, isRead: undefined }}),
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
    try {
      if (!userId) throw new Error('未登录')
    } catch (e) {
      return ctx.body = {
        code: this.CODE.USER_NOT_LOGIN,
        success: false,
        msg: e.message
      }
    }
    const filter = { receiveUserId: userId }
    try {
      const [total, unreadTotal, unreadComment, unreadLike, unreadCollect] = await prisma.$transaction([
        prisma.notification.count({where: filter}),
        prisma.notification.count({where: { ...filter, isRead: 0 }}),
        prisma.notification.count({where: { ...filter, isRead: 0, OR: [{ type: 'comment' }, { type: 'comment_reply' }] }}),
        prisma.notification.count({where: { ...filter, isRead: 0, type: 'like_blog' }}),
        prisma.notification.count({where: { ...filter, isRead: 0, type: 'collect_blog' }}),
      ])

      return ctx.body = {
        success: true,
        result: {
          total,
          unreadTotal,
          unreadComment,
          unreadLike,
          unreadCollect,
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
              content: true
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
    const { id, isAll = 0, type } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!userId) throw new Error('未登录')
    } catch (e) {
      return ctx.body = {
        code: this.CODE.USER_NOT_LOGIN,
        success: false,
        msg: e.message
      }
    }
    let where = {}
    if(id){
      where.id = {
        in: id.toString().split(',').map(i => Number(i))
      }
    }
    if(isAll){
      where.isRead = 0
    }
    if(type) {
      const typeList = type.split(',')
      where.OR = []
      for(let t of typeList){
        where.OR.push({
          type: this.NOTIFICATION_TYPE[t]
        })
      }
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
