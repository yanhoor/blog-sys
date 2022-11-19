const BaseController = require('./baseController')
const prisma = require('../database/prisma')

class BlogCateController extends BaseController {
  edit = async (ctx, next) => {
    const {name, id} = ctx.request.body
    try {
      if (!name) throw new Error('分类名不能为空')

    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    if (id) {
      const cate = await prisma.blogCate.findUnique({
        where: {id}
      })
      if (!cate) {
        return ctx.body = {
          success: false,
          msg: '分类不存在'
        }
      }
      try {
        const userId = ctx.state.user.id
        const nCate = await prisma.blogCate.update({
          where: {id},
          data: {
            name
          }
        })
        return ctx.body = {
          success: true,
          result: nCate
        }
      } catch (e) {
        this.errorLogger.error('blogCate.update--------->', e)
      }
    } else {
      try {
        const userId = ctx.state.user.id
        const nCate = await prisma.blogCate.create({
          data: {
            name,
            createById: userId,
          }
        })
        return ctx.body = {
          success: true,
          result: nCate
        }
      } catch (e) {
        this.errorLogger.error('blogCate.create--------->', e)
      }
    }
  }

  list = async (ctx, next) => {
    const {name, page = 1, pageSize = this.pageSize} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = {}
    if (name) filter.name = {contains: name}
    try {
      const [list, total] = await prisma.$transaction([
        prisma.blogCate.findMany({
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
        prisma.blogCate.count({where: filter})
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    } catch (e) {
      this.errorLogger.error('blogCate.list--------->', e)
    }
  }

  all = async (ctx, next) => {
    try {
      const result = await prisma.blogCate.findMany({
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
      this.errorLogger.error('blogCate.all--------->', e)
    }
  }

  info = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      const result = await prisma.blogCate.findUnique({
        where: {
          id
        },
      })

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('blogCate.info--------->', e)
    }
  }

  delete = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      await prisma.blogCate.update({
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
      this.errorLogger.error('blogCate.delete--------->', e)
    }
  }
}

module.exports = new BlogCateController()
