const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  const req = ctx.request
  const { name, avatar, introduce, gender, birthday, profileCardBg } = req.body
  let id = await this.getAuthUserId(ctx, next)
  try {
    if (!name) throw new Error('名称不能为空')
    if (name.length > 8) throw new Error('用户名不能超过8个字符')
    const u1 = await prisma.user.findFirst({ where: { name } })
    if (u1 && id !== u1.id) throw new Error('该用户名已存在')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }
  const form = {
    name,
    avatar,
    introduce,
    gender: Number(gender),
    birthday: new Date(birthday),
    profileCardBg
  }
  try {
    const result = await prisma.user.update({
      where: { id },
      data: form
    })
    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('user.update--------->', e)
  }
}
