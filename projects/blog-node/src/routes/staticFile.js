const path = require('path')
const fs = require('fs')
const router = require('koa-router')()
const { defaultLogger, errorLogger } = require('../log')
const sharp = require('sharp')
const mime = require('mime')

router.prefix('/static')

router.get('/uploadFile/:filename', async (ctx, next) => {
  const { filename } = ctx.request.params
  const { quality, type } = ctx.request.query
  try {
    // 对于静态资源，如 /manage/assets/index.4e3bc69a.js, 直接获取，并添加 mime 类型
    const p = path.join(__dirname, '../../../', './uploadFile/' + filename)
    ctx.cacheControl = {
      maxAge: 60 * 60 * 24 * 30 * 3
    }
    const mimeType = mime.getType(filename)
    defaultLogger.info('========读取文件=========', filename, mimeType, type)

    if (mimeType.includes('image')) {
      let file = fs.readFileSync(p)
      if (mimeType.includes('gif')) {
        // file = await sharp(file).gif().toBuffer()
      } else {
        file = await sharp(file)
          .webp({ quality: Number(quality) || 80 })
          .toBuffer()
        ctx.type = 'image/webp' // 修改响应类型
      }
      defaultLogger.info('========读取图片=========', filename, mimeType)
      return (ctx.body = file) // 修改响应体
    }

    if (
      ['video', 'audio'].includes(type) ||
      mimeType.includes('video') ||
      mimeType.includes('audio')
    ) {
      const range = ctx.request.header['range']
      let stats = fs.statSync(p)
      let bytes = range.split('=')[1]
      // const ranges = rangeParse(range)
      // let [start, end] = ranges[0]
      let start = Number.parseInt(bytes.split('-')[0]) // 开始位置
      let end = Number.parseInt(bytes.split('-')[1]) || stats.size - 1 // 结束位置
      let stream = fs.createReadStream(p, { start: start, end: end })
      // 设置 Response Headers
      ctx.set('Content-Range', `bytes ${start}-${end}/${stats.size}`)
      ctx.set('Accept-Range', `bytes`)
      ctx.set('Content-Type', 'application/octet-stream')
      // 返回状态码
      ctx.status = 206
      // ctx.type = mimeType
      // ctx.type = 'application/octet-stream'
      defaultLogger.info('========读取视频=========', filename)
      return (ctx.body = stream)
    }

    const file = fs.readFileSync(p)
    return (ctx.body = file)
    // defaultLogger.info('========读取静态资源=========', file, mimeType)
  } catch (e) {
    errorLogger.error('=====/static/uploadFile=======', e)
  }
})

function rangeParse(str) {
  const token = str.split('=')
  if (!token || token.length !== 2 || token[0] !== 'bytes') {
    return null
  }
  return token[1]
    .split(',')
    .map((range) => {
      return range.split('-').map((value) => {
        if (value === '') {
          return Infinity
        }
        return Number(value)
      })
    })
    .filter((range) => {
      return !isNaN(range[0]) && !isNaN(range[1]) && range[0] <= range[1]
    })
}

module.exports = router
