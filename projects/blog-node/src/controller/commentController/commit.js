const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const { mySocketIo, SOCKETEVENTTYPE } = require('../../socketIo')
const { commentFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  let { content, blogId, replyToId, imageId, topCommentId, replyCommentId } =
    ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  imageId = imageId || null
  content = content ? content.trim() : null

  try {
    if (!content && !imageId) throw new Error('评论不能为空')
    if (!userId) throw new Error('用户未登录')
    if (!blogId) throw new Error('博客id不能为空')
    if (replyToId) {
      const user = await prisma.user.findUnique({
        where: { id: replyToId }
      })
      if (!user) throw new Error('用户不存在')
    }
    if (topCommentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: topCommentId }
      })
      if (!comment) throw new Error('评论不存在')
    }
    if (replyCommentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: replyCommentId }
      })
      if (!comment) throw new Error('评论不存在')
    }
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    if (replyCommentId) {
      const toComment = await prisma.comment.findUnique({
        where: {
          id: replyCommentId
        }
      })
      if (!toComment || toComment.deletedAt) {
        return (ctx.body = {
          success: false,
          msg: '回复的评论不存在'
        })
      }
    }

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId
      }
    })
    if (!blog || blog.deletedAt) {
      return (ctx.body = {
        success: false,
        msg: '回复的博客不存在'
      })
    }

    const data = {
      createById: userId,
      blogId,
      content,
      imageId
    }
    if (replyToId) {
      data.replyToId = replyToId
      data.topCommentId = topCommentId
      data.replyCommentId = replyCommentId
    }
    const res = await prisma.comment.create({
      data,
      select: {
        ...commentFieldExpose.select
      }
    })
    const nd = {
      createById: userId,
      receiveUserId: blog.createById,
      type: this.NOTIFICATION_TYPE.comment,
      blogId,
      commentId: res.id
    }
    if (replyToId) {
      if (replyToId != userId) {
        // 通知评论回复的用户
        nd.receiveUserId = replyToId
        nd.type = this.NOTIFICATION_TYPE.comment_reply
        const notification = await prisma.notification.create({
          data: nd,
          select: {
            id: true,
            createdAt: true,
            content: true,
            isRead: true,
            type: true,
            createById: true,
            blogId: true,
            commentId: true,
            comment: {
              select: {
                id: true,
                content: true
              }
            }
          }
        })
        mySocketIo.ioInstance
          .to(replyToId.toString())
          .emit(SOCKETEVENTTYPE.notification, notification)
      }
    } else if (blog.createById != userId) {
      // 通知博客作者
      const notification = await prisma.notification.create({
        data: nd,
        select: {
          id: true,
          createdAt: true,
          content: true,
          isRead: true,
          type: true,
          createById: true,
          blogId: true,
          commentId: true,
          comment: {
            select: {
              id: true,
              content: true
            }
          }
        }
      })
      mySocketIo.ioInstance
        .to(blog.createById.toString())
        .emit(SOCKETEVENTTYPE.notification, notification)
    }
    return (ctx.body = {
      success: true,
      result: res
    })
  } catch (e) {
    this.errorLogger.error('comment.create--------->', e)
  }
}
