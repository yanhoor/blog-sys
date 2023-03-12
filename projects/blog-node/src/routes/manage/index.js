const manageRouter = require('koa-router')()
const jwt = require('koa-jwt')
const config = require('config-lite')(__dirname)
const uploadRouter = require('./upload')
const userRouter = require('./user')
const blogRouter = require('./blog')
const statisRouter = require('./statis')
const commentRouter = require('../visit/comment')

manageRouter.prefix('/api-manage')

// 这里调用引入的jwt方法，最终会得到一个中间件
manageRouter.use(
  jwt({
    secret: config.jwtSecret,
    // cookie: 'token', // 从 cookie 中获取token
    debug: true // 开启debug可以看到准确的错误信息
  })
    .unless({
      custom: (ctx) => ['/login', '/adminLogin', '/register'].some(item => ctx?.url.includes(item))
    }) // 以/login或/register结尾不使用 jwt 中间件
)

manageRouter.use(uploadRouter.routes(), uploadRouter.allowedMethods())
manageRouter.use(userRouter.routes(), userRouter.allowedMethods())
manageRouter.use(blogRouter.routes(), blogRouter.allowedMethods())
manageRouter.use(statisRouter.routes(), statisRouter.allowedMethods())
manageRouter.use(commentRouter.routes(), commentRouter.allowedMethods())

module.exports = manageRouter
