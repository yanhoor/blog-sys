const prisma = require('../../database/prisma')
const fs = require('fs')
module.exports = async function (ctx, next) {
  const req = ctx.request
  const { md5 } = req.body
  // console.log('======upload========', file.size, file.size > 2 * 1024 * 1024)

  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
    if (!md5) throw new Error('md5 不存在')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    let fileRes = await prisma.file.findUnique({
      where: {
        md5,
        createById: userId
      },
      select: {
        id: true,
        md5: true,
        url: true,
        createById: true
      }
    })

    const filesList = await fs.promises.readdir(config.uploadDir)
    const chunkList = filesList.filter((f) => f.startsWith(md5))

    if (fileRes) {
      return (ctx.body = {
        success: true,
        result: {
          isChunk: false,
          file: fileRes
        }
      })
    } else if (chunkList.length) {
      return (ctx.body = {
        success: true,
        result: {
          isChunk: true,
          chunkList
        }
      })
    } else {
      return (ctx.body = {
        success: true,
        msg: '文件不存在'
      })
    }
  } catch (e) {
    this.errorLogger.error('checkFile--------->', e)
    return (ctx.body = {
      success: false,
      msg: e?.message || e
    })
  }
}
