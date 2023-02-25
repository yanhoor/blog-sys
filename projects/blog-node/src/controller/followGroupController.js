const BaseController = require('./baseController')
const prisma = require('../database/prisma')

class FollowGroupController extends BaseController {
  edit = async (ctx, next) => {
    let {name, id} = ctx.request.body
    id = Number(id)
    let userId = await this.getAuthUserId(ctx, next)
    try {
      if (!userId) throw new Error('未登录')
      if (!name) throw new Error('分组名不能为空')
      if (name.length > 8) throw new Error('分组名不能超过8个字符')

      if(id){
        const group = await prisma.followGroup.findUnique({
          where: {id}
        })

        if (!group || group.createById !== userId) throw new Error('分组不存在')
        if(group.system === 1) throw new Error('系统分组不允许修改')
      }
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    if (id) {
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
        const group = await prisma.followGroup.findUnique({
          where: {
            name
          }
        })
        if(group && group.createById === userId) {
          return ctx.body = {
            success: false,
            msg: '已有相同名称的分组'
          }
        }

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
            system: true,
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
      if(!userId){
        return ctx.body = {
          success: false,
          code: this.CODE.USER_NOT_LOGIN,
          msg: '未登录'
        }
      }
      const xprisma = prisma.$extends({
        result: {
          followGroup: {
            // 在返回的结果新增自定义字段
            memberCount: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { containUsers: true },
              compute(item) {
                // 计算获取这个新字段值的逻辑，即从何处来
                return item.containUsers.length
              },
            },
          }
        }
      })
      const result = await xprisma.followGroup.findMany({
        where: {
          createById: userId
        },
        select: {
          id: true,
          name: true,
          system: true,
          memberCount: true
        },
        orderBy: [
          {system: 'asc'},
          {sort: 'asc'},
          {updatedAt: 'desc'},
        ]
      })

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('followGroup.all--------->', e)
    }
  }

  sort = async (ctx, next) => {
    const {ids} = ctx.request.body
    try {
      if (!ids) throw new Error('参数不全')
    } catch (e) {
      return ctx.body = {
        success: false,
        msg: e.message
      }
    }

    try {
      await prisma.$transaction(ids.split(',').map((id, idx) => {
        return prisma.followGroup.update({
          where: {
            id: Number(id)
          },
          data: {
            sort: idx + 100
          }
        })
      }))

      return ctx.body = {
        success: true
      }
    } catch (e) {
      this.errorLogger.error('followGroup.sort--------->', e)
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
    let curUserId = await this.getAuthUserId(ctx, next)
    try {
      if (!curUserId) throw new Error('未登录')

      const group = await prisma.followGroup.findUnique({
        where: {
          id
        }
      })

      if (!group || group.createById !== curUserId) throw new Error('分组不存在')
      if(group.system === 1) throw new Error('系统分组不允许删除')
    } catch (e) {
      return ctx.body = {
        success: false,
        msg: e.message
      }
    }
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
