const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next){
  const { id, isCollect } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  try{
    if(!id) throw new Error('博客id不能为空')
    if(!userId) throw new Error('用户未登录')
    if(isCollect === undefined) throw new Error('isCollect不能为空')
  }catch(e){
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  let currentBlog
  try{
    currentBlog = await prisma.blog.findUnique({
      where: { id }
    })
    if(isCollect){
      await prisma.blog.update({
        where: { id },
        data: {
          collectedBy: {
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

      await redisClient.sAdd(this.REDIS_KEY_PREFIX.COLLECT_BLOG_USER + id, userId.toString())

      if(Number(userId) !== currentBlog.createById){
        const notification = await prisma.notification.create({
          data: {
            createById: Number(userId),
            receiveUserId: currentBlog.createById,
            type: this.NOTIFICATION_TYPE.collect_blog,
            blogId: Number(id),
          }
        })
      }
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
          collectedBy: {
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

      await redisClient.sRem(this.REDIS_KEY_PREFIX.COLLECT_BLOG_USER + id, userId.toString())
    }

    // 更新被收藏数
    const num = await redisClient.sCard(this.REDIS_KEY_PREFIX.COLLECT_BLOG_USER + id)
    await redisClient.zAdd(this.REDIS_KEY_PREFIX.BLOG_COLLECT_RANKING, { score: num, value: id.toString() })
    await redisClient.hSet(this.REDIS_KEY_PREFIX.EVERY_BLOG_COLLECT_USER + currentBlog.createById, id, num)

    return ctx.body = {
      success: true
    }
  }catch (e) {
    this.errorLogger.error('blog.collect--------->', e)
  }
}
