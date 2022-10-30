const router = require('koa-router')()
const uploadRouter = require('../manage/upload')
const userRouter = require('../manage/user')
const blogCateRouter = require('../manage/blogCate')
const blogRouter = require('../manage/blog')

router.prefix('/api')

router.use(uploadRouter.routes(), uploadRouter.allowedMethods())
router.use(userRouter.routes(), userRouter.allowedMethods())
router.use(blogCateRouter.routes(), blogCateRouter.allowedMethods())
router.use(blogRouter.routes(), blogRouter.allowedMethods())

module.exports = router
