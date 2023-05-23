const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const { mySocketIo, SOCKETEVENTTYPE } = require('../../socketIo')

module.exports = async function (ctx, next) {
  let { content, blogId, replyToId, imageId, topCommentId, replyCommentId } =
    ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  imageId = imageId ? Number(imageId) : null
  blogId = Number(blogId)
  replyToId = Number(replyToId)
  topCommentId = Number(topCommentId)
  replyCommentId = Number(replyCommentId)
  content = content ? content.trim() : null

  try {
    if (!content && !imageId) throw new Error('评论不能为空')
    if (!userId) throw new Error('用户未登录')
    if (!blogId) throw new Error('博客id不能为空')
    if (replyToId) {
      const user = await prisma.user.findUnique({
        where: { id: Number(replyToId) }
      })
      if (!user) throw new Error('用户不存在')
    }
    if (topCommentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(topCommentId) }
      })
      if (!comment) throw new Error('评论不存在')
    }
    if (replyCommentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(replyCommentId) }
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
        id: Number(blogId)
      }
    })
    if (!blog || blog.deletedAt) {
      return (ctx.body = {
        success: false,
        msg: '回复的博客不存在'
      })
    }

    const data = {
      createById: Number(userId),
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
            avatar: true
          }
        },
        imageId: true,
        image: {
          select: {
            id: true,
            createById: true,
            type: true,
            url: true
          }
        },
        replyTo: {
          select: {
            id: true,
            name: true,
            avatar: true
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
                avatar: true
              }
            },
            imageId: true,
            image: {
              select: {
                id: true,
                createById: true,
                type: true,
                url: true
              }
            },
            replyTo: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    })
    const nd = {
      createById: Number(userId),
      receiveUserId: blog.createById,
      type: this.NOTIFICATION_TYPE.comment,
      blogId: Number(blogId),
      commentId: res.id
    }
    if (replyToId) {
      if (replyToId != userId) {
        // 通知评论回复的用户
        nd.receiveUserId = Number(replyToId)
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
