const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { id } = ctx.request.params
  let currentUserId = await this.getAuthUserId(ctx, next)
  try {
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
          },
          isFollowing: {
            needs: { followers: true },
            compute(user) {
              return user.followers.some(u => u.followById === currentUserId)
            }
          },
          isMyFan: {
            needs: { followings: true },
            compute(user) {
              return user.followings.some(u => u.userId === currentUserId)
            }
          },
          // 是否互相关注
          isMutualFollowing: {
            needs: { followers: true, followings: true },
            compute(user) {
              const isFollowing = user.followers.some(u => u.followById === currentUserId)
              const isFollowed = user.followings.some(u => u.userId === currentUserId)
              return isFollowed && isFollowing
            }
          }
        }
      }
    })
    const user = await xprisma.user.findUnique({
      where: {
        id: Number(id)
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
        isFollowing: true,
        isMyFan: true,
        isMutualFollowing: true,
        // blogs: {
        //   select: {
        //     id: true,
        //     updatedAt: true,
        //     title: true,
        //     content: true,
        //     cate: {
        //       select: {
        //         id: true,
        //         name: true
        //       }
        //     }
        //   }
        // }
      }
    })

    if(!user){
      return ctx.body = {
        success: false,
        code: this.CODE.USER_NOT_FOUND,
        msg: '用户不存在'
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
    this.errorLogger.error('user.userInfo--------->', e)
  }
}
