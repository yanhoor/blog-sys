const prisma = require('../../database/prisma')

module.exports = async function (ctx, next) {
  const { groupId, userId } = ctx.request.body
  try {
    if (!groupId || !userId) throw new Error('参数不全')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const idList = groupId.split(',')
    const res = await prisma.user.update({
      where: {
        id: userId // 关注的用户id
      },
      data: {
        inFollowGroups: {
          set: idList.map((id) => ({ id }))
        }
      }
    })

    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('user.setGroup--------->', e)
  }
}
