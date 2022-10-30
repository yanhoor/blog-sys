const BaseController = require('./baseController')
const prisma = require('../database/prisma')

class BlogController extends BaseController{
  list = async (ctx, next) => {
    console.log('++++++++++++++++')
    const {title, page = 1, pageSize = this.pageSize} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = {}
    if (title) filter.title = {contains: title}
    try {
      const [list, total] = await prisma.$transaction([
        prisma.blog.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            content: true,
            cate: {
              select: {
                id: true,
                name: true
              }
            },
            title: true
          },
          orderBy: {updatedAt: 'desc'}
        }),
        prisma.blog.count({where: filter})
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }
    } catch (e) {
      console.log('=======blog.list=======', e)
    }
  }

  edit = async (ctx, next) => {
    const {title, content, cateId, id} = ctx.request.body
    try {
      if (!title) throw new Error('标题不能为空')
      if (!content) throw new Error('内容不能为空')
      if (!cateId) throw new Error('分类名不能为空')
    } catch (e) {
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    const newItem = {
      title,
      content,
      cateId
    }
    if (id) {
      const blog = await prisma.blog.findUnique({
        where: {id}
      })
      if (!blog) {
        return ctx.body = {
          success: false,
          msg: '博客不存在'
        }
      }
      try {
        const res = await prisma.blog.update({
          where: {id},
          data: newItem
        })
        return ctx.body = {
          success: true,
          result: res
        }
      } catch (e) {
        console.log('=======blog.update=========', e)
      }
    } else {
      try {
        const userId = ctx.state.user.id
        newItem.createById = userId
        const res = await prisma.blog.create({
          data: newItem
        })
        return ctx.body = {
          success: true,
          result: res
        }
      } catch (e) {
        console.log('=======blog.create=========', e)
      }
    }
  }


  info = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      const result = await prisma.blog.findUnique({
        where: {
          id: Number(id)
        },
      })

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      console.log('=======blog.info=========', e)
    }
  }

  delete = async (ctx, next) => {
    const {id} = ctx.request.body
    try {
      await prisma.blog.update({
        where: {
          id: Number(id)
        },
        data: {
          deletedAt: new Date()
        }
      })

      return ctx.body = {
        success: true
      }
    } catch (e) {

    }
  }
}

module.exports = new BlogController()
