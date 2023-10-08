const md5File = require('md5-file')
const prisma = require('../../database/prisma')
const fs = require('fs')

// 对分片文件改名
const handleLocalUploadPart = async (ctx, next) => {
  const req = ctx.request
  const { chunkPath } = req.body
  const file = req.files.file

  try {
    const fp = file.filepath
    const idx = fp.lastIndexOf('/')
    await fs.promises.rename(fp, fp.slice(0, idx + 1) + chunkPath)
    return (ctx.body = {
      success: true
    })
  } catch (e) {
    this.errorLogger.error('分片上传处理失败--------->', e)
    return (ctx.body = {
      success: false,
      msg: e?.message || e || '上传失败'
    })
  }
}

module.exports = async function (ctx, next) {
  const req = ctx.request
  const { type, isPartFile = 0 } = req.body
  const file = req.files.file
  // console.log('======upload========', file.size, file.size > 2 * 1024 * 1024)

  this.defaultLogger.info('=========接收到文件========')
  let userId = await this.getAuthUserId(ctx, next)
  try {
    if (!userId) throw new Error('未登录')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  let fileRes

  try {
    // 分片上传
    if (isPartFile) {
      return handleLocalUploadPart(ctx, next)
    }

    // 其他单文件
    const m5 = await md5File(file.filepath)
    fileRes = await prisma.file.findUnique({
      where: {
        md5: m5
      },
      select: {
        id: true,
        md5: true,
        url: true,
        createById: true
      }
    })
    if (!fileRes || fileRes.createById !== userId) {
      // if (file.size < config.multiPartUploadSwitchSize * 1024 * 1024) {
      //   fullName = await this.handleUpload(file, m5)
      // } else {
      //   fullName = await this.handleMultipartUpload(file, m5)
      // }
      const idx = file.filepath.lastIndexOf('/')
      const localName = file.filepath.slice(idx + 1)
      // const fileType = type || this.getFileType(fullName)
      const fileType = type || this.getFileType(localName)
      console.log('=======新建上传文件信息=======', file.filepath, localName)
      fileRes = await prisma.file.create({
        data: {
          createById: userId,
          md5: m5,
          // url: fullName,
          url: localName,
          type: fileType
        },
        select: {
          id: true,
          md5: true,
          url: true,
          createById: true
        }
      })
    }

    return (ctx.body = {
      success: true,
      result: fileRes
    })
  } catch (e) {
    this.errorLogger.error('upload--------->', e)
    return (ctx.body = {
      success: false,
      msg: e?.message || e || '上传失败'
    })
  }
}
