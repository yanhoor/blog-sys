const router = require('koa-router')()
const uploadRouter = require('../manage/upload')
const userRouter = require('../manage/user')
const blogRouter = require('../manage/blog')
const commentRouter = require('./comment')
const mediaRouter = require('./media')
const topicRouter = require('./topic')
const notificationRouter = require('./notification')
const followGroupRouter = require('./followGroup')
const statisRouter = require('../manage/statis')

router.prefix('/api')

router.use(uploadRouter.routes(), uploadRouter.allowedMethods())
router.use(userRouter.routes(), userRouter.allowedMethods())
router.use(blogRouter.routes(), blogRouter.allowedMethods())
router.use(commentRouter.routes(), commentRouter.allowedMethods())
router.use(mediaRouter.routes(), mediaRouter.allowedMethods())
router.use(topicRouter.routes(), topicRouter.allowedMethods())
router.use(notificationRouter.routes(), notificationRouter.allowedMethods())
router.use(followGroupRouter.routes(), followGroupRouter.allowedMethods())
router.use(statisRouter.routes(), statisRouter.allowedMethods())

// 测试 jsonp
router.get('/jsonp', async (ctx, next) => {
  const callback = ctx.request.query.callback
  // ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Content-Type', 'text/javascript')
  ctx.body = `${callback}(${JSON.stringify({ a: 12 })})`
})

module.exports = router
