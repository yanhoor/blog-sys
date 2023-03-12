const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function(ctx, next) {
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
