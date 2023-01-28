const BaseController = require('./baseController')
const prisma = require('../database/prisma')

class FollowGroupController extends BaseController {
  edit = async (ctx, next) => {
    const {name, id} = ctx.request.body
    try {
      if (!name) throw new Error('分组名不能为空')
      const nCate = await prisma.followGroup.findUnique({
        where: {
          name
        }
      })
      if(nCate) throw new Error('已有相同名称的分组')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }
    let userId = await this.getAuthUserId(ctx, next)

    if (id) {
      const cate = await prisma.followGroup.findUnique({
        where: {id}
      })
      if (!cate) {
        return ctx.body = {
          success: false,
          msg: '分组不存在'
        }
      }
      try {
        const nCate = await prisma.followGroup.update({
          where: {id},
          data: {
            name
          },
          select: {
            id: true,
            name: true
          }
        })
        return ctx.body = {
          success: true,
          result: nCate
        }
      } catch (e) {
        this.errorLogger.error('followGroup.update--------->', e)
      }
    } else {
      try {
        const nCate = await prisma.followGroup.create({
          data: {
            name,
            createById: userId,
          },
          select: {
            id: true,
            name: true
          }
        })
        return ctx.body = {
          success: true,
          result: nCate
        }
      } catch (e) {
        this.errorLogger.error('followGroup.create--------->', e)
      }
    }
  }

  list = async (ctx, next) => {
    const {name, page = 1, pageSize = this.pageSize} = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)
    const skip = pageSize * (page - 1)
    const filter = { createById: userId }
    if (name) filter.name = {contains: name}
    try {
      const [list, total] = await prisma.$transaction([
        prisma.followGroup.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            name: true
          },
          orderBy: {updatedAt: 'desc'}
        }),
        prisma.followGroup.count({where: filter})
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    } catch (e) {
      this.errorLogger.error('followGroup.list--------->', e)
    }
  }

  all = async (ctx, next) => {
    try {
      let userId = await this.getAuthUserId(ctx, next)
      const result = await prisma.followGroup.findMany({
        where: {
          createById: userId
        },
        select: {
          id: true,
          name: true
        },
        orderBy: {updatedAt: 'desc'}
      })

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('followGroup.all--------->', e)
    }
  }

  info = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      const result = await prisma.followGroup.findUnique({
        where: {
          id
        },
      })

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('followGroup.info--------->', e)
    }
  }

  delete = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      await prisma.followGroup.update({
        where: {
          id
        },
        data: {
          deletedAt: new Date()
        }
      })

      return ctx.body = {
        success: true
      }
    } catch (e) {
      this.errorLogger.error('followGroup.delete--------->', e)
    }
  }

  // 获取用户所在关注分组
  containList = async (ctx, next) => {
    const { userId } = ctx.request.body
    let curUserId = await this.getAuthUserId(ctx, next)
    try {
      if (!userId) throw new Error('参数不全')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try {
      const result = await prisma.followGroup.findMany({
        where: {
          createById: curUserId,
          containUsers: {
            some: {
              id: userId
            }
          }
        },
        select: {
          id: true,
          name: true
        }
      })

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('followGroup.containList--------->', e)
    }
  }
}

module.exports = new FollowGroupController()
