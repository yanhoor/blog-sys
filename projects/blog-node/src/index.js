const koa = require('koa')
const cors = require('koa2-cors')
const { koaBody } = require('koa-body') // 在 ctx.request.body 获取请求参数
const manageRouter = require('./routes/manage')
const visitRouter = require('./routes/visit')
const mount = require('koa-mount')
const fs = require("fs");
const path = require('path')
const mime = require('mime')
const { websocket } = require('./websocket')
const { defaultLogger, errorLogger } = require('./log')

const app = new koa()

// jwt 校验登录
app.use(async (ctx, next) => {
  return next().catch(err => {
    if (401 == err.status) {
      defaultLogger.warn('jwt 鉴权失败')
      ctx.status = 401;
      ctx.body = '401 Unauthorized - Protected resource, use Authorization header to get access\n';
    } else {
      defaultLogger.error('jwt 鉴权失败', err.message)
      throw err;
    }
  });
});

// try{
//     fs.mkdirSync(path.join(__dirname, config.uploadDir))
// }catch(e){
//     console.log(e)
// }
app.use(koaBody({multipart: true}))
// app.use(koaBody({
//     // 支持文件格式
//     multipart: true,
//     formidable: {
//         // 上传目录
//         uploadDir: path.join(__dirname, '..', config.uploadDir), // 即当前文件路径 + 设置的路径
//         // 保留文件扩展名
//         keepExtensions: true
//     }
// }))

app.use(cors({
  origin(ctx){
    const { origin, Origin, referer, Referer } = ctx.request.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    return 'http://localhost:3000';
  },
  credentials: true,
  maxAge: 60 * 60 * 24,
  allowMethods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// 处理 history 路由模式刷新404
app.use(async (ctx, next) => {
  const matchUrl = '/manage' // 需要判断的路径
  await next() // 等待请求执行完毕
  const curUrl = ctx.request.url
  if(ctx.response.status === 404 && curUrl.includes(matchUrl)){
    if (!curUrl.includes('.')) {
      // 对于页面路由，返回 index.html
      ctx.type = 'text/html; charset=utf-8' // 修改响应类型
      ctx.body= fs.readFileSync(path.resolve(__dirname, '../public/manage/index.html')) // 修改响应体
    }else{
      // 对于静态资源，如 /manage/assets/index.4e3bc69a.js, 直接获取，并添加 mime 类型
      const p = path.join(__dirname, '../public', ctx.request.url)
      ctx.type = mime.getType(ctx.request.url) // 修改响应类型
      ctx.body= fs.readFileSync(p) // 修改响应体
    }
  }
})

app.use(mount('/manage', require('koa-static')(__dirname + '../public/manage'))) // 将 /public/web 下的目录挂载到 /manage，注意：接口也有/manage前缀

app.use(visitRouter.routes())
app.use(manageRouter.routes())

const server = app.listen(8000)
websocket.init(server)
