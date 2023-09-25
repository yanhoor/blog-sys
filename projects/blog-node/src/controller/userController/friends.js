const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let { relateType, uid, page = 1, pageSize = this.pageSize } = ctx.request.body
  const skip = pageSize * (page - 1)
  let filter = { ALL_DATA: true }
  let orderBy = {}
  try {
    if (!relateType || !uid) throw new Error('缺少参数')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  switch (Number(relateType)) {
    // 关注
    case 1:
      filter.followById = uid
      orderBy.assignedAt = {
        assignedAt: 'desc'
      }
      break
    // 粉丝
    case 2:
      filter.userId = uid
      orderBy.followings = {
        assignedAt: 'desc'
      }
      break
  }

  try {
    const xprisma = prisma.$extends({
      result: {
        user: {
          // 是否互相关注
          isMutualFollowing: {
            needs: { followers: true, followings: true },
            compute(user) {
              const isFollowing = user.followers.some(
                (u) => u.followById === uid
              )
              const isFollowed = user.followings.some((u) => u.userId === uid)
              return isFollowed && isFollowing
            }
          },
          isFollowing: {
            needs: { followers: true },
            compute(result) {
              return result.followers.some((u) => u.followById === uid)
            }
          },
          followerCount: {
            needs: { followers: true },
            compute(result) {
              return result.followers.length
            }
          }
        }
      }
    })

    // 先查出对应关系
    const [refList, total] = await prisma.$transaction([
      prisma.followRelation.findMany({
        skip,
        take: pageSize,
        where: JSON.parse(JSON.stringify(filter)),
        orderBy: {
          assignedAt: 'desc'
        },
        select: {
          assignedAt: true,
          userId: true,
          followById: true
        }
      }),
      prisma.followRelation.count({ where: filter })
    ])

    // 再用关系查找用户信息
    const list = await xprisma.user.findMany({
      where: {
        id: {
          in: refList.map((ref) =>
            Number(relateType) === 1 ? ref.userId : ref.followById
          )
        }
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        introduce: true,
        followerCount: true,
        isFollowing: true,
        isMutualFollowing: true
      }
    })

    return (ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    })
  } catch (e) {
    this.errorLogger.error('user.friends--------->', e)
  }
}
