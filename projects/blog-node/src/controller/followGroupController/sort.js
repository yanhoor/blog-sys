const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { ids } = ctx.request.body
  try {
    if (!ids) throw new Error('参数不全')
  } catch (e) {
    return (ctx.body = {
      success: false,
      msg: e.message
    })
  }

  try {
    await prisma.$transaction(
      ids.split(',').map((id, idx) => {
        return prisma.followGroup.update({
          where: {
            id
          },
          data: {
            sort: idx + 100
          }
        })
      })
    )

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('followGroup.sort--------->', e)
  }
}
