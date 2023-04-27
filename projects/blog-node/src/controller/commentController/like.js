const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  let { id, isLike } = ctx.request.body
  id = Number(id)
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
    await prisma.comment.findUnique({
      where: { id }
    })
    if (isLike) {
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
