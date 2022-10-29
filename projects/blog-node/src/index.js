const koa = require('koa')
const { koaBody } = require('koa-body') // 在 ctx.request.body 获取请求参数
const config = require('config-lite')(__dirname)
const manageRouter = require('./routes/manage')

const app = new koa()

// jwt 校验登录
app.use((ctx, next) => {
  return next().catch(err => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = '401 Unauthorized - Protected resource, use Authorization header to get access\n';
    } else {
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

app.use(manageRouter.routes())

app.listen(8000)
