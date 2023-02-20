const BaseController = require('./baseController')
const prisma = require('../database/prisma')

class CommentController extends BaseController{
  commit = async (ctx, next) => {
    const { content, blogId, replyToId, topCommentId, replyCommentId } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)

    try{
      if(!content) throw new Error('评论不能为空')
      if(!userId) throw new Error('用户未登录')
      if(!blogId) throw new Error('博客id不能为空')
      if(replyToId){
        const user = await prisma.user.findUnique({ where: { id: Number(replyToId) } })
        if(!user) throw new Error('用户不存在')
      }
      if(topCommentId){
        const comment = await prisma.comment.findUnique({ where: { id: Number(topCommentId) } })
        if(!comment) throw new Error('评论不存在')
      }
      if(replyCommentId){
        const comment = await prisma.comment.findUnique({ where: { id: Number(replyCommentId) } })
        if(!comment) throw new Error('评论不存在')
      }
    }catch(e){
      ctx.body = {
        success: false,
        msg: e.message
      }
      return false
    }

    try{
      const data = {
        createById: Number(userId),
        blogId: Number(blogId),
        content
      }
      if(replyToId){
        data.replyToId = Number(replyToId)
        data.topCommentId = Number(topCommentId)
        data.replyCommentId = Number(replyCommentId)
      }
      const res = await prisma.comment.create({
        data,
        select: {
          id: true,
          createdAt: true,
          content: true,
          blogId: true,
          topCommentId: true,
          replyCommentId: true,
          createById: true,
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          replyTo: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          replyComment: {
            select: {
              id: true,
              createdAt: true,
              content: true,
              blogId: true,
              topCommentId: true,
              createBy: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                }
              },
              replyTo: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                }
              },
            }
          }
        }
      })
      const blog = await prisma.blog.findUnique({
        where: {
          id: Number(blogId)
        }
      })
      const nd = {
        createById: Number(userId),
        receiveUserId: blog.createById,
        type: this.NOTIFICATION_TYPE.comment,
        blogId: Number(blogId),
        commentId: res.id
      }
      if(replyToId){
        if(replyToId != userId) {
          // 通知评论回复的用户
          nd.receiveUserId = Number(replyToId)
          nd.type = this.NOTIFICATION_TYPE.comment_reply
          const notification = await prisma.notification.create({
            data: nd
          })
          this.websocket.sendWsMessage(replyToId, JSON.stringify({
            type: this.WEBSOCKET_MESSAGE_TYPE.notification,
            id: notification.id
          }))
        }
      } else if(blog.createById != userId){
        // 通知博客作者
        const notification = await prisma.notification.create({
          data: nd
        })
        this.websocket.sendWsMessage(blog.createById, JSON.stringify({
          type: this.WEBSOCKET_MESSAGE_TYPE.notification,
          id: notification.id
        }))
      }
      return ctx.body = {
        success: true,
        result: res
      }
    }catch (e) {
      this.errorLogger.error('comment.create--------->', e)
    }
  }

  // 评论列表
  list = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize, blogId, sort = 1} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = { blogId: Number(blogId), topCommentId: null }
    let orderBy = { createdAt: 'desc' }
    switch (sort) {
      case 1:
        orderBy = { createdAt: 'desc' }
        break
      case 2:
        orderBy = { childComments: { _count: 'desc' } }
        break
    }
    try {
      const xprisma = prisma.$extends({
        result: {
          comment: {
            childCommentsCount: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { childComments: true },
              compute(comment) {
                // 计算获取这个新字段值的逻辑，即从何处来
                const list = comment.childComments.filter(c => !c.deletedAt)
                return list.length
              },
            }
          }
        }
      })
      const [list, total] = await prisma.$transaction([
        // todo: 为毛用了 xprisma 下面的 childComments select 就无效
        prisma.comment.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            content: true,
            blogId: true,
            topCommentId: true,
            createById: true,
            // childCommentsCount: true, // 会使 childComments select 无效
            _count: {
              select: {
                childComments: {
                  where: {
                    // topCommentId: blogId,
                    deletedAt: null
                  },
                }
              }, // 这个数量错误，包含了已删除的
            },
            childComments: {
              take: 2,
              where: {
                deletedAt: null
              },
              // 可以用include
              select: {
                id: true,
                createdAt: true,
                content: true,
                blogId: true,
                topCommentId: true,
                replyCommentId: true,
                createById: true,
                createBy: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  }
                },
                replyTo: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  }
                },
                replyComment: {
                  select: {
                    id: true,
                    createdAt: true,
                    content: true,
                    blogId: true,
                    topCommentId: true,
                    deletedAt: true,
                    createById: true,
                    createBy: {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                      }
                    },
                    replyTo: {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                      }
                    },
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
            },
            replyTo: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          },
          orderBy
        }),
        prisma.comment.count({where: filter})
      ])

      list.forEach(item => {
        item.childCommentsCount = item._count.childComments
        delete item._count
      })

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

  // 评论的回复列表
  replyList = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize, blogId, topCommentId } = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = { blogId: Number(blogId), topCommentId: Number(topCommentId) }
    try {
      const [topComment, list, total] = await prisma.$transaction([
        prisma.comment.findUnique({
          where: {
            id: Number(topCommentId)
          },
          select: {
            id: true,
            createdAt: true,
            content: true,
            blogId: true,
            createById: true,
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
          }
        }),
        prisma.comment.findMany({
          skip,
          take: pageSize,
          where: filter,
          select: {
            id: true,
            createdAt: true,
            content: true,
            blogId: true,
            topCommentId: true,
            replyCommentId: true,
            createById: true,
            replyComment: {
              select: {
                id: true,
                createdAt: true,
                content: true,
                blogId: true,
                topCommentId: true,
                createById: true,
                createBy: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true
                  }
                },
              }
            },
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            replyTo: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          },
          // 评论的回复是升序，旧的在前面
          orderBy: { createdAt: 'asc' }
        }),
        prisma.comment.count({where: filter})
      ])

      return ctx.body = {
        success: true,
        result: {
          topComment,
          list,
          total
        }
      }
    } catch (e) {
      this.errorLogger.error('blog.replyList--------->', e)
    }
  }

  delete = async (ctx, next) => {
    const { id } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)

    try{
      if(!id) throw new Error('缺少参数: id')
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) }
      })
      if(!comment || comment.createById !== userId) throw new Error('评论不存在')
    }catch (e) {
      return ctx.body = {
        success: false,
        msg: e.message
      }
    }

    try{
      await prisma.$transaction([
        prisma.comment.update({
          where: { id: Number(id) },
          data: {
            deletedAt: new Date()
          }
        }),
        prisma.comment.updateMany({
          where: {
            OR: [
              { topCommentId: Number(id) },
              { replyCommentId: Number(id) },
            ]
          },
          data: {
            deletedAt: new Date()
          }
        })
      ])
      return ctx.body = {
        success: true
      }
    }catch (e) {
      this.errorLogger.error('comment.delete--------->', e)
    }
  }
}

module.exports = new CommentController()
