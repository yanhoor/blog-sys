const manageRouter = require('koa-router')()
const jwt = require('koa-jwt')
const config = require('config-lite')(__dirname)

manageRouter.prefix('/api-manage')

// 这里调用引入的jwt方法，最终会得到一个中间件
manageRouter.use(
  jwt({
    secret: config.jwtSecret,
    // cookie: 'token', // 从 cookie 中获取token
    debug: true // 开启debug可以看到准确的错误信息
  })
    .unless({ custom: (ctx) => /\/login$|\/register$/.test(ctx?.url) }) // 以/login或/register结尾不使用 jwt 中间件
)

module.exports = manageRouter
