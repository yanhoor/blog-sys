const router = require('koa-router')()
const uploadRouter = require('../manage/upload')
const userRouter = require('../manage/user')
const blogCateRouter = require('../manage/blogCate')
const blogRouter = require('../manage/blog')
const commentRouter = require('./comment')

router.prefix('/api')

router.use(uploadRouter.routes(), uploadRouter.allowedMethods())
router.use(userRouter.routes(), userRouter.allowedMethods())
router.use(blogCateRouter.routes(), blogCateRouter.allowedMethods())
router.use(blogRouter.routes(), blogRouter.allowedMethods())
router.use(commentRouter.routes(), commentRouter.allowedMethods())

// 测试 jsonp
router.get('/jsonp', async (ctx, next) => {
  const callback = ctx.request.query.callback
  // ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Content-Type', 'text/javascript')
  ctx.body = `${callback}(${JSON.stringify({a: 12})})`
})

module.exports = router
