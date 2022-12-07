const BaseController = require('./baseController')
const prisma = require('../database/prisma')
class NotificationController extends BaseController{
  list = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize} = ctx.request.body
    const skip = pageSize * (page - 1)
    let userId = await this.getAuthUserId(ctx, next)
    const filter = { receiveUserId: userId }
    try {
      const [list, total, unreadTotal] = await prisma.$transaction([
        prisma.notification.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            isRead: true,
            content: true,
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
        prisma.notification.count({where: { ...filter, isRead: 0 }})
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total,
          unreadTotal
        }
      }
    } catch (e) {
      this.errorLogger.error('notification.list--------->', e)
    }
  }
}

module.exports = new NotificationController()
