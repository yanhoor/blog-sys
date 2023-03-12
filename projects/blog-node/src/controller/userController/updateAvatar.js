const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { avatar } = ctx.request.body
  const id = ctx.state.user.id
  try{
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        avatar
      }
    })
    return ctx.body = {
      success: true
    }
  }catch (e) {
    this.errorLogger.error('user.edit--------->', e)
  }
}
