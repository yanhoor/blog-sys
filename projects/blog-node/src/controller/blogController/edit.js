const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')

module.exports = async function (ctx, next) {
  let {
    medias = [],
    content,
    id,
    address,
    addressName,
    latitude,
    longitude
  } = ctx.request.body
  latitude = Number(latitude)
  longitude = Number(longitude)
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!content) throw new Error('内容不能为空')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  const newItem = {
    content,
    updatedAt: new Date()
  }
  if (latitude) {
    newItem.address = address
    newItem.addressName = addressName
    newItem.latitude = latitude
    newItem.longitude = longitude
  }
  if (id) {
    const blog = await prisma.blog.findUnique({
      where: { id }
    })
    if (!blog) {
      return (ctx.body = {
        success: false,
        msg: '博客不存在'
      })
    }
    try {
      const oldList = await prisma.media.findMany({
        where: {
          blogId: id
        }
      })
      const editList = []
      const addList = []
      medias.forEach((item) => {
        item.id ? editList.push(item) : addList.push(item)
      })
      const notList = editList.filter((item) =>
        oldList.every((old) => old.id !== item.id)
      )
      if (notList.length) {
        const notIdList = notList.map((item) => item.id)
        return (ctx.body = {
          success: false,
          msg: `以下媒体id不存在：${notIdList.toString()}`
        })
      }
      addList.forEach((item) => {
        item.createById = userId
      })
      const deleteList = oldList.filter((old) =>
        editList.every((item) => item.id !== old.id)
      )
      const res = await prisma.blog.update({
        where: { id },
        data: {
          ...newItem,
          medias: {
            updateMany: {
              where: {
                id: {
                  in: deleteList.map((item) => item.id)
                }
              },
              data: {
                deletedAt: new Date()
              }
            }
          }
        }
      })
      return (ctx.body = {
        success: true,
        result: res
      })
    } catch (e) {
      this.errorLogger.error('blog.update--------->', e)
    }
  } else {
    try {
      medias.forEach((item) => {
        item.createById = userId
      })
      newItem.createById = userId
      const res = await prisma.blog.create({
        data: {
          ...newItem,
          medias: {
            create: medias.map((m) => {
              const med = {
                createById: userId,
                fileId: m.fileId
              }
              if (m.cover) {
                med.coverId = m.cover.id
              }
              return med
            })
          }
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          createById: true,
          status: true,
          content: true,
          address: true,
          addressName: true,
          latitude: true,
          longitude: true,
          createBy: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          medias: {
            where: {
              deletedAt: null
            },
            select: {
              id: true,
              fileId: true,
              file: {
                select: {
                  id: true,
                  createById: true,
                  type: true,
                  url: true
                }
              },
              coverId: true,
              cover: {
                select: {
                  id: true,
                  createById: true,
                  type: true,
                  url: true
                }
              }
            }
          }
        }
      })
      // 创建博客数递增
      await redisClient.zIncrBy(
        this.REDIS_KEY_PREFIX.BLOG_CREATE_RANKING,
        1,
        userId.toString()
      )
      return (ctx.body = {
        success: true,
        result: res
      })
    } catch (e) {
      this.errorLogger.error('blog.create--------->', e)
    }
  }
}
