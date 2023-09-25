const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  let { id, isLike } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!id) throw new Error('评论id不能为空')
    if (!userId) throw new Error('用户未登录')
    if (isLike === undefined) throw new Error('isLike不能为空')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const co = await prisma.comment.findUnique({
      where: { id }
    })
    if (!co) {
      return (ctx.body = {
        success: false,
        msg: '点赞的评论不存在'
      })
    }

    console.log('=========点赞评论id=========', id)
    if (isLike) {
      const rel = await prisma.userLikeCommentRelation.findUnique({
        where: {
          ALL_DATA: true,
          userId_commentId: {
            userId: userId,
            commentId: id
          }
        }
      })

      if (rel) {
        return (ctx.body = {
          success: true,
          msg: '已点赞'
        })
      }

      await prisma.comment.update({
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
    } else {
      const rel = await prisma.userLikeCommentRelation.findUnique({
        where: {
          ALL_DATA: true,
          userId_commentId: {
            userId: userId,
            commentId: id
          }
        }
      })

      if (!rel) {
        return (ctx.body = {
          success: true,
          msg: '已取消点赞'
        })
      }

      // 这样好像也可以
      // await prisma.userLikeBlogs.delete({
      //   where: {
      //     userId_blogId: {
      //       userId,
      //       blogId: id
      //     }
      //   }
      // })
      await prisma.comment.update({
        where: { id },
        data: {
          likedBy: {
            delete: [
              // 删除相关 UserLikeBlogs
              {
                userId_commentId: {
                  userId,
                  commentId: id
                }
              }
            ]
          }
        }
      })
    }
    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('comment.like--------->', e)
  }
}
