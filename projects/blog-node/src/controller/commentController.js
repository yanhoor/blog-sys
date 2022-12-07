const BaseController = require('./baseController')
const prisma = require('../database/prisma')

class CommentController extends BaseController{
  commit = async (ctx, next) => {
    const { content, blogId, replyToId, replyCommentId } = ctx.request.body
    let userId = await this.getAuthUserId(ctx, next)

    try{
      if(!content) throw new Error('评论不能为空')
      if(!userId) throw new Error('用户未登录')
      if(!blogId) throw new Error('博客id不能为空')
      if(replyCommentId){
        const comment = await prisma.comment.findUnique({ where: { id: Number(replyCommentId) } })
        const user = await prisma.user.findUnique({ where: { id: Number(replyToId) } })
        if(!comment) throw new Error('评论不存在')
        if(!user) throw new Error('用户不存在')
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
        data.replyCommentId = Number(replyCommentId)
      }
      const res = await prisma.comment.create({
        data
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

  list = async (ctx, next) => {
    const {page = 1, pageSize = this.pageSize, blogId, replyCommentId} = ctx.request.body
    const skip = pageSize * (page - 1)
    const filter = { blogId: Number(blogId), replyCommentId: replyCommentId ? Number(replyCommentId) : null }
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
            replyCommentId: true,
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
          orderBy: {createdAt: 'desc'}
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
}

module.exports = new CommentController()
