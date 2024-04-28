const prisma = require('../../database/prisma')
const redisClient = require('../../database/redis')
const { blogFieldExpose } = require('../../exposeField')

module.exports = async function (ctx, next) {
  let {
    medias = [],
    content,
    referenceId,
    address,
    contentType,
    addressName,
    latitude,
    longitude
  } = ctx.request.body
  latitude = Number(latitude)
  longitude = Number(longitude)
  if(contentType) contentType = Number(contentType)
  let userId = await this.getAuthUserId(ctx, next)
  const newItem = {
    content,
    contentType,
    updatedAt: new Date()
  }
  let referenceBlog = null
  let referenceBlogIdList = []
  try {
    if (!referenceId && !content) throw new Error('内容不能为空')

    if (referenceId) {
      referenceBlog = await prisma.blog.findUnique({
        where: { id: referenceId },
        include: {
          referenceBlogs: true
        }
      })
      if (!referenceBlog) throw new Error('转发的博客不存在')
      const previousRefBlogIdList =
        referenceBlog.referenceBlogs.map((ref) => ref.id) || []
      referenceBlogIdList = [referenceBlog.id, ...previousRefBlogIdList]
      newItem.retweetOriginBlogId =
        referenceBlog.retweetOriginBlogId || referenceBlog.id
    }
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  if (latitude) {
    newItem.address = address
    newItem.addressName = addressName
    newItem.latitude = latitude
    newItem.longitude = longitude
  }
  try {
    newItem.createById = userId
    // 两个#之间不能有空白符或者#/@
    let topicList = content.match(/#[^#@\s\]\[]+#/g) || [] // 含 # 的话题
    topicList = [...new Set(topicList)]
    topicList = topicList.map((t) => ({
      origin: t,
      content: t.slice(1, -1)
      // offset: content.indexOf(t)
    }))
    // 上传的媒体内容列表
    const newMediaIdList = []
    const mediasData = medias.map((m) => {
      const id = this.createUUID()
      newMediaIdList.push(id)
      const med = {
        id,
        createById: userId,
        fileId: m.fileId
      }
      med.coverId = m.coverId || m.cover?.id || null
      return med
    })
    // 转发博客带有图片，把图片信息插入文本内容
    if (referenceId && mediasData.length) {
      let idx = newItem.content.search(/\/\/@[^\s#\[@:]+/g) // 查找 //@xxx 开始位置
      const mediaTxt = `[m${mediasData[0].id}]`
      if (idx === -1) {
        newItem.content += mediaTxt
      } else {
        newItem.content = [
          newItem.content.slice(0, idx),
          mediaTxt,
          newItem.content.slice(idx)
        ].join('')
      }
    }
    const [_, res] = await prisma.$transaction([
      prisma.media.createMany({
        data: mediasData
      }),

      prisma.blog.create({
        data: {
          ...newItem,
          medias: {
            connect: newMediaIdList.map((id) => ({ id }))
          },
          referenceBlogs: {
            connect: referenceBlogIdList.map((id) => ({ id }))
          },
          topics: {
            // 创建 BlogTopicRelation
            create: topicList.map((t) => ({
              // offset: t.offset,
              topic: {
                connectOrCreate: {
                  where: {
                    content: t.content
                  },
                  create: {
                    content: t.content,
                    createById: userId
                  }
                }
              }
            }))
          }
        },
        select: blogFieldExpose.select
      })
    ])
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
    return (ctx.body = {
      success: false,
      msg: e.toString()
    })
  }
}
