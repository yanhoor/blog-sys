const fs = require('fs')
const md5File = require('md5-file')
const prisma = require('../../database/prisma')
const config = require('config-lite')(__dirname)

module.exports = async function (ctx, next) {
  const req = ctx.request
  const { fileName, ext, type } = req.body
  let userId = await this.getAuthUserId(ctx, next)

  try {
    if (!userId) throw new Error('未登录')
    if (!ext || !fileName) throw new Error('参数错误')
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message
    }
    return false
  }

  try {
    const outputPath = config.uploadDir + fileName + '.' + ext
    const filesList = await fs.promises.readdir(config.uploadDir)
    const chunkList = filesList
      .filter((f) => f.startsWith(fileName + '-'))
      .sort((a, b) => {
        const idxa = a.lastIndexOf('-')
        const idxb = b.lastIndexOf('-')
        return Number(a.slice(idxa + 1)) - Number(b.slice(idxb + 1))
      })
    this.defaultLogger.info(
      '========mergeMultiPart=========',
      chunkList,
      outputPath
    )
    if (!chunkList.length) {
      return (ctx.body = {
        success: false,
        msg: '分片不存在'
      })
    }

    const writeStream = fs.createWriteStream(outputPath)
    for (const chunk of chunkList) {
      const chunkPath = config.uploadDir + chunk
      const readStream = fs.createReadStream(chunkPath)
      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream, { end: false })
        readStream.on('end', () => {
          fs.promises.unlink(chunkPath)
          resolve()
        })
        readStream.on('error', reject)
      })
    }

    writeStream.end()

    const fileType = type || this.getFileType(ext)
    const m5 = await md5File(outputPath)
    this.defaultLogger.info('=======新建上传文件信息=======', m5)
    let fileRes = await prisma.file.create({
      data: {
        createById: userId,
        md5: m5,
        url: fileName + '.' + ext,
        type: fileType
      },
      select: {
        id: true,
        md5: true,
        url: true,
        createById: true
      }
    })

    return (ctx.body = {
      success: true,
      result: fileRes
    })
  } catch (e) {
    this.errorLogger.error('mergeMultiPart--------->', e)
    return (ctx.body = {
      success: false,
      msg: e?.message || e || '合并文件失败'
    })
  }
}
