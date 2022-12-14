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
              sign: true,
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
                  sign: true,
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
        content: JSON.stringify({
          type: 'comment',
          blogId: Number(blogId),
          commentId: res.id,
          content
        })
      }
      if(replyToId){
        if(replyToId != userId) {
          // 通知评论回复的用户
          nd.receiveUserId = Number(replyToId)
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
    const {page = 1, pageSize = this.pageSize, blogId} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = { blogId: Number(blogId), topCommentId: null }
    try {
      const xprisma = prisma.$extends({
        result: {
          comment: {
            replyCount: {
              // 计算这个新字段值需要依赖的真实字段
              needs: { replyItems: true },
              compute(comment) {
                // 计算获取这个新字段值的逻辑，即从何处来
                return comment.replyItems.length
              },
            }
          }
        }
      })
      const [list, total] = await prisma.$transaction([
        // todo: 为毛用了 xprisma 下面的 replyItems select 就无效
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
            // replyCount: true,
            _count: {
              select: { childComments: true },
            },
            childComments: {
              take: 2,
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
                    sign: true,
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
                    createById: true,
                    createBy: {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                        sign: true,
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
                sign: true,
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
          orderBy: { createdAt: 'desc' }
        }),
        prisma.comment.count({where: filter})
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

  // 评论的回复列表
  replyList = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize, blogId, topCommentId} = ctx.request.body
    const skip = pageSize * (page - 1) + 2 // 已经显示2条
    const filter = { blogId: Number(blogId), topCommentId: Number(topCommentId) }
    try {
      const [list, total] = await prisma.$transaction([
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
                    avatar: true,
                    sign: true,
                  }
                },
              }
            },
            createBy: {
              select: {
                id: true,
                name: true,
                avatar: true,
                sign: true,
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
          list,
          total
        }
      }
    } catch (e) {
      this.errorLogger.error('blog.replyList--------->', e)
    }
  }
}

module.exports = new CommentController()
