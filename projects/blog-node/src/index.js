const koa = require('koa')
const cors = require('koa2-cors')
const { koaBody } = require('koa-body') // 在 ctx.request.body 获取请求参数
const manageRouter = require('./routes/manage')
const visitRouter = require('./routes/visit')
const staticRouter = require('./routes/staticFile')
const { mySocketIo } = require('./socketIo')
const { defaultLogger, errorLogger } = require('./log')
const path = require('path')
const config = require('config-lite')(__dirname)
const fs = require('fs')
const cacheControl = require('koa-cache-control')
const conditional = require('koa-conditional-get')
const etag = require('koa-etag')

const app = new koa()

const uploadDir = path.join(__dirname, '../../', config.uploadDir)
try {
  console.log('======filePath======', uploadDir)
  fs.mkdirSync(uploadDir)
} catch (e) {
  console.log(e)
}

app.use(
  cacheControl({
    maxAge: 5
  })
)
app.use(conditional())
app.use(etag())
// app.use(koaBody({ multipart: true }))

app.use(
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: uploadDir, // 即当前文件路径 + 设置的路径
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024 // 200m
    }
  })
)

// jwt 校验登录
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      defaultLogger.warn('jwt 鉴权失败')
      ctx.status = 401
      ctx.body =
        '401 Unauthorized - Protected resource, use Authorization header to get access\n'
    } else {
      defaultLogger.error('jwt 鉴权失败', err.message)
      throw err
    }
  })
})

app.use(
  cors({
    origin(ctx) {
      const { origin, Origin, referer, Referer } = ctx.request.headers
      const allowOrigin = origin || Origin || referer || Referer || '*'
      // return 'http://192.168.3.31:7878'
      return allowOrigin
      // return '*'
    },
    credentials: true,
    maxAge: 60 * 60 * 24,
    allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
)

// 处理 history 路由模式刷新404
// app.use(async (ctx, next) => {
//   const matchUrl = '/uploadFile' // 需要判断的路径
//   await next() // 等待请求执行完毕
//   const curUrl = ctx.request.url
//   console.log('========curUrl========', curUrl)
//   if (ctx.response.status === 404 && curUrl.includes(matchUrl)) {
//     // 访问的是静态资源
//     if (curUrl.includes('.')) {
//       // 对于静态资源，如 /manage/assets/index.4e3bc69a.js, 直接获取，并添加 mime 类型
//       const p = path.join(
//         __dirname,
//         '../../',
//         ctx.request.url.replace('/api', '')
//       )
//       ctx.type = mime.getType(ctx.request.url) // 修改响应类型
//       ctx.body = fs.readFileSync(p) // 修改响应体
//     } else {
//       // 对于页面路由，返回 index.html
//       ctx.type = 'text/html; charset=utf-8' // 修改响应类型
//       ctx.body = fs.readFileSync(
//         path.resolve(__dirname, '../public/manage/index.html')
//       ) // 修改响应体
//     }
//   }
// })
//
// app.use(koaMount('/uploadFile', koaStatic(uploadDir))) // 将 /public/web 下的目录挂载到 /manage，注意：接口也有/manage前缀

app.use(staticRouter.routes())
app.use(visitRouter.routes())
app.use(manageRouter.routes())

const server = app.listen(8000)
server.keepAliveTimeout = 30 * 1000
mySocketIo.init(server)
