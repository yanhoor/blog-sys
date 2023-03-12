const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const { type, id } = ctx.request.body
  try{
    if(!type) throw new Error('缺少参数 type')
    if(!id) throw new Error('缺少参数 id')
  }catch(e){
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }
  try{
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        lock: type
      }
    })
    return ctx.body = {
      success: true
    }
  }catch (e) {
    this.errorLogger.error('user.operateLock--------->', e)
  }
}
