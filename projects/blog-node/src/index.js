const koa = require('koa')
const cors = require('koa2-cors')
const { koaBody } = require('koa-body') // 在 ctx.request.body 获取请求参数
const manageRouter = require('./routes/manage')
const visitRouter = require('./routes/visit')
const staticRouter = require('./routes/staticFile')
const { mySocketIo } = require('./socketIo')
const { defaultLogger, errorLogger } = require('./log')
const config = require('config-lite')(__dirname)
const fs = require('fs')
const etag = require('koa-etag')

const app = new koa()

handleCreateUploadDir()

async function handleCreateUploadDir() {
  await fs.promises.mkdir(config.uploadDir).catch((e) => {
    defaultLogger.info('==========创建上传文件目录===========', e)
  })
  const filesList = await fs.promises.readdir(config.uploadDir)
  // 删除所有未合并的分片文件
  const deleteList = filesList.filter((f) => !f.includes('.'))
  defaultLogger.info('==========待删除分片文件列表===========', deleteList)
  deleteList.forEach((d) => {
    fs.promises.unlink(config.uploadDir + d).catch((e) => {
      defaultLogger.error('============删除分片文件失败===========', d, e)
    })
  })
}

app.use(etag())
// app.use(koaBody({ multipart: true }))

app.use(
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: config.uploadDir, // 即当前文件路径 + 设置的路径
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
// server.keepAliveTimeout = 30 * 1000 // 用于指定长连接的超时时间。如果客户端在超时时间内没有发送任何数据，则服务器会关闭连接。这个选项可以防止服务器长时间占用不活跃的连接。
mySocketIo.init(server)
