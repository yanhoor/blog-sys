const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  // type: 1--点赞,2--收藏
  const { blogId, page = 1, pageSize = this.pageSize } = ctx.request.body
  const { type } = ctx.request.params
  const skip = pageSize * (page - 1)
  try {
    if (!blogId) throw new Error('博客id不能为空')
    if (!type) throw new Error('type不能为空')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    let userId = await this.getAuthUserId(ctx, next)
    const blog = await prisma.blog.findUnique({
      where: {
        id: Number(blogId)
      },
      select: {
        likedBy: {
          skip,
          take: pageSize,
          select: {
            userId: true
          }
        },
        collectedBy: {
          skip,
          take: pageSize,
          select: {
            userId: true
          }
        }
      }
    })

    const xprisma = prisma.$extends({
      result: {
        user: {
          followerCount: {
            needs: { followers: true },
            compute(result) {
              return result.followers.length
            }
          },
          isFollowing: {
            needs: { followers: true },
            compute(result) {
              return result.followers.some((u) => u.followById === userId)
            }
          }
        }
      }
    })
    let idList = []
    if (Number(type) === 1) {
      idList = blog.likedBy.map((i) => i.userId)
    }
    if (Number(type) === 2) {
      idList = blog.collectedBy.map((i) => i.userId)
    }
    const list = await xprisma.user.findMany({
      where: {
        id: {
          in: idList
        }
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        introduce: true,
        followerCount: true,
        isFollowing: true
      }
    })

    return (ctx.body = {
      success: true,
      result: {
        list
      }
    })
  } catch (e) {
    this.errorLogger.error('blog.likeList--------->', e)
  }
}
