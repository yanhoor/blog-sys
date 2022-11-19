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
      this.errorLogger.error('blog.list--------->', e)
    }
  }

  list2 = async (ctx, next) => {
    try {
      const { title, page = 1, pageSize = this.pageSize } = ctx.request.body
      const skip = pageSize * (page - 1)
      const filter = { launch: 1 }
      if (title) filter.title = { contains: title }
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
          orderBy: { updatedAt: 'desc' }
        }),
        prisma.blog.count({ where: filter })
      ])

      return ctx.body = {
        success: true,
        result: {
          list,
          total
        }
      }

    } catch (e) {
      this.errorLogger.error('blog.list2--------->', e)
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
        this.errorLogger.error('blog.update--------->', e)
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
        this.errorLogger.error('blog.create--------->', e)
      }
    }
  }


  info = async (ctx, next) => {
    const {id} = ctx.request.body
    // const userId = ctx.state.user.id
    const token = ctx.headers['authorization']
    let userId = undefined
    if(token) {
      const user = await jsonwebtoken.verify(token.replace(/Bearer /g, ''), config.jwtSecret)
      userId = user.id
    }
    try {
      const [result, isLike] = await prisma.$transaction([
        prisma.blog.findUnique({
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
        }),

        prisma.userLikeBlogs.count({
          where: {
            userId,
            blogId: Number(id),
            noDelete: true
          }
        })
      ])

      result.isLike = !!isLike

      return ctx.body = {
        success: true,
        result
      }
    } catch (e) {
      this.errorLogger.error('blog.info--------->', e)
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
      this.errorLogger.error('blog.delete--------->', e)
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
      this.errorLogger.error('blog.operate--------->', e)
    }
  }

  // 点赞博客
  like = async (ctx, next) => {
    const { id, isLike } = ctx.request.body
    try{
      if(!id) throw new Error('博客id不能为空')
      if(isLike === undefined) throw new Error('isLike不能为空')
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try{
      // 为毛这个 undefined
      // const userId = ctx.state.user.id
      const token = ctx.headers['authorization']
      const { id: userId } = await jsonwebtoken.verify(token.replace(/Bearer /g, ''), config.jwtSecret)
      if(isLike){
        await prisma.blog.update({
          where: { id },
          data: {
            likedBy: {
              create: [
                // 创建 UserLikeBlogs
                {
                  user: {
                    // 连接到操作的 user
                    connect: {
                      id: userId
                    }
                  }
                }
              ]
            }
          }
        })
      }else{
        // 这样好像也可以
        // await prisma.userLikeBlogs.delete({
        //   where: {
        //     userId_blogId: {
        //       userId,
        //       blogId: id
        //     }
        //   }
        // })
        await prisma.blog.update({
          where: { id },
          data: {
            likedBy: {
              delete: [
                // 删除相关 UserLikeBlogs
                {
                  userId_blogId: {
                    userId,
                    blogId: id
                  }
                }
              ]
            }
          }
        })
      }

      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('blog.like--------->', e)
    }
  }
}

module.exports = new BlogController()
