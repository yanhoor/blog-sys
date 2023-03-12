const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const req = ctx.request;
  const { password, mobile, name } = req.body
  try{
    if(!name) throw new Error('名称不能为空')
    if(!password) throw new Error('密码不能为空')
    if(!mobile) throw new Error('手机号不能为空')

    if(name.length > 8) throw new Error('用户名不能超过8个字符')
    const u1 = await prisma.user.findFirst({where: {name}})
    if(u1) throw new Error('该用户名已存在')

    const u = await prisma.user.findFirst({where: {mobile}})
    if(u) throw new Error('该手机号已注册')
  }catch(e){
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try{
    const user = await prisma.user.create({
      data: {
        password,
        mobile,
        name,
        birthday: null,
        followGroups: {
          create: [
            { name: '特别关注', system: 1 }
          ]
        }
      }
    })
    return ctx.body = {
      success: true,
      result: '注册成功'
    }
  }catch (e) {
    this.errorLogger.error('user.register--------->', e)
  }
}
