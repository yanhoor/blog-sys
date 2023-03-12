const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const jsonwebtoken = require('jsonwebtoken')

module.exports = async function (ctx, next) {
  const req = ctx.request;
  const { password, mobile } = req.body
  try{
    if(!password) throw new Error('密码不能为空')
    if(!mobile) throw new Error('手机号不能为空')
  }catch(e){
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        mobile
      }
    })
    if(!user){
      return ctx.body = {
        success: false,
        msg: '该手机号未注册'
      }
    }
    if(user.lock === 1){
      return ctx.body = {
        success: false,
        code: 111,
        msg: '您的账号已经被锁定，请联系管理员解锁'
      }
    }
    if(user?.password === password) {
      const token = jsonwebtoken.sign({ id: user.id }, this.globalConfig.jwtSecret, { expiresIn: this.globalConfig.jwtTokenExpired }) // expiresIn token过期秒数
      await redisClient.set(this.REDIS_KEY_PREFIX.TOKEN + user.id, token, { EX: this.globalConfig.jwtTokenExpired })
      ctx.body = {
        success: true,
        msg: '登录成功',
        result: token
      }
    }else{
      ctx.body = {
        success: false,
        msg: '密码错误'
      }
    }
  }catch (e) {
    this.errorLogger.error('user.login--------->', e)
  }
}
