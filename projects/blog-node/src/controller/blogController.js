const BaseController = require('./baseController')
const prisma = require('../database/prisma')
const config = require('config-lite')(__dirname)
const jsonwebtoken = require('jsonwebtoken')

class BlogController extends BaseController{
  list = async (ctx, next) => {
    const {title, page = 1, pageSize = this.pageSize} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = { createById: ctx.state.user.id }
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
            launch: true,
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

  list2 = async (ctx, next) => {
    const {title, page = 1, pageSize = this.pageSize} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = { launch: 1 }
    if (title) filter.title = {contains: title}
    try {
      const [list, total] = await prisma.$transaction([
        prisma.blog.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            launch: true,
            cate: {
              select: {
                id: true,
                name: true
              }
            },
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            _count: {
              select: { likedBy: true },
            },
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
      console.log('=======blog.visitList=======', e)
    }
  }

  edit = async (ctx, next) => {
    const {title, content, cateId, id} = ctx.request.body
    try {
      if (!title) throw new Error('标题不能为空')
      if (!content) throw new Error('内容不能为空')
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
      if (blog.launch) {
        return ctx.body = {
          success: false,
          msg: '博客已发布，不能修改'
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
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          launch: true,
          content: true,
          cate: {
            select: {
              id: true,
              name: true
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
      console.log('=========blog.delete==========', e)
    }
  }

  // 发布/取消发布
  operate = async (ctx, next) => {
    const {id, launch} = ctx.request.body
    try {
      if (launch === undefined) throw new Error('缺少参数 launch')
    } catch (e) {
      return ctx.body = {
        success: false,
        msg: e.message
      }
    }

    try {
      const blog = await prisma.blog.findUnique({
        where: {id}
      })
      if (!blog) {
        return ctx.body = {
          success: false,
          msg: '博客不存在'
        }
      }
      const t = new Date()
      await prisma.blog.update({
        where: {
          id: Number(id)
        },
        data: {
          operateAt: t,
          launch
        }
      })

      return ctx.body = {
        success: true
      }
    } catch (e) {
      console.log('=========blog.operate==========', e)
    }
  }
}

module.exports = new BlogController()
