const path = require('path')
const fs = require('fs')
const router = require('koa-router')()
const { defaultLogger, errorLogger } = require('../log')
const sharp = require('sharp')
const mime = require('mime')

router.prefix('/static')

router.get('/uploadFile/:filename', async (ctx, next) => {
  const { filename } = ctx.request.params
  const { quality } = ctx.request.query
  try {
    // 对于静态资源，如 /manage/assets/index.4e3bc69a.js, 直接获取，并添加 mime 类型
    const p = path.join(__dirname, '../../../', './uploadFile/' + filename)
    let file = fs.readFileSync(p)
    const mimeType = mime.getType(filename)
    if (mimeType.includes('image')) {
      if (mimeType.includes('gif')) {
        // file = await sharp(file).gif().toBuffer()
      } else {
        file = await sharp(file)
          .webp({ quality: Number(quality) || 80 })
          .toBuffer()
        ctx.type = 'image/webp' // 修改响应类型
      }
    }
    defaultLogger.info('========读取静态资源=========', file, mimeType)
    ctx.body = file // 修改响应体
  } catch (e) {
    errorLogger.error('=====/static/uploadFile=======', e)
  }
})

module.exports = router
