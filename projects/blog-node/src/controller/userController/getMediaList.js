const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const config = require('config-lite')(__dirname)

module.exports = async function (ctx, next) {
  const {type, userId, page = 1, pageSize = this.pageSize } = ctx.request.body
  const skip = pageSize * (page - 1)
  let filter = { createById: userId }
  try{
    if(!type || !userId) throw new Error('缺少参数')
  }catch(e){
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  switch (Number(type)) {
    // 图片
    case 1:
      filter.OR = config.imgTypeList.map(t => ({
        url: {
          endsWith: t
        }
      }))
      break
    // 视频
    case 2:
      filter.OR = config.videoTypeList.map(t => ({
        url: {
          endsWith: t
        }
      }))
      break
  }

  try {
    const [list, total] = await prisma.$transaction([
      prisma.media.findMany({
        skip,
        take: pageSize,
        where: filter,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          url: true,
          blogId: true,
          blog: {
            select: {
              id: true,
              content: true
            }
          }
        }
      }),
      prisma.media.count({ where: filter })
    ])

    return ctx.body = {
      success: true,
      result: {
        list,
        total
      }
    }
  }catch (e) {
    this.errorLogger.error('user.getMediaList--------->', e)
  }
}
