const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let id
  try{
    id = await this.getAuthUserId(ctx, next)
    const t = await redisClient.get(this.REDIS_KEY_PREFIX.TOKEN + id)
    if(!t){
      return ctx.body = {
        success: false,
        code: this.CODE.USER_NOT_LOGIN,
        msg: '登录信息已过期，请重新登录'
      }
    }

    const xprisma = prisma.$extends({
      result: {
        user: {
          followerCount: {
            needs: { followers: true },
            compute(user) {
              return user.followers.length
            }
          },
          followingCount: {
            needs: { followings: true },
            compute(user) {
              return user.followings.length
            }
          }
        }
      }
    })
    const user = await xprisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        profileCardBg: true,
        // mobile: true,
        createdAt: true,
        lock: true,
        introduce: true,
        gender: true,
        birthday: true,
        followerCount: true,
        followingCount: true,
      }
    })
    await prisma.user.update({
      where: { id },
      data: {
        lastActiveAt: new Date()
      }
    })
    if(user.lock === 1){
      return ctx.body = {
        success: false,
        code: this.CODE.USER_LOCK,
        msg: '您的账号已经被锁定，请联系管理员解锁'
      }
    }

    // 收到的点赞数
    const likeList = await redisClient.hVals(this.REDIS_KEY_PREFIX.EVERY_BLOG_LIKE_USER + user.id)
    const likedCount = likeList.reduce((pre, cur) => Number(pre) + Number(cur), 0)
    user.likedCount = likedCount

    return ctx.body = {
      success: true,
      result: user
    }
  }catch (e) {
    this.errorLogger.error('user.info--------->', e)
  }
}
