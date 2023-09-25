const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { type, id } = ctx.request.body
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!type) throw new Error('缺少参数 type')
    if (!id) throw new Error('缺少参数 id')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    // 关注
    if (Number(type) === 1) {
      const rel = await prisma.followRelation.findUnique({
        where: {
          ALL_DATA: true,
          userId_followById: {
            userId: id,
            followById: userId
          }
        }
      })

      if (rel) {
        return (ctx.body = {
          success: true,
          msg: '已关注'
        })
      }

      const user = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          followings: {
            create: [
              {
                user: {
                  connect: {
                    id
                  }
                }
              }
            ]
          }
        }
      })
    }

    // 取消关注
    if (Number(type) === 2) {
      const rel = await prisma.followRelation.findUnique({
        where: {
          ALL_DATA: true,
          userId_followById: {
            userId: id,
            followById: userId
          }
        }
      })

      if (!rel) {
        return (ctx.body = {
          success: true,
          msg: '已取消关注'
        })
      }

      const gList = await prisma.followGroup.findMany({
        where: {
          createById: userId
        },
        select: {
          id: true
        }
      })

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id // 关注的用户id
          },
          data: {
            inFollowGroups: {
              disconnect: gList
            }
          }
        }),
        prisma.user.update({
          where: {
            id: userId
          },
          data: {
            followings: {
              delete: [
                {
                  userId_followById: {
                    userId: id,
                    followById: userId
                  }
                }
              ]
            }
          }
        })
      ])
    }

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('user.operateFollow--------->', e)
  }
}
