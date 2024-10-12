const Router = require('@koa/router')
const router = new Router()
const controller = require('../../controller/mediaController/index')

router.prefix('/media')

router.post('/info', controller.info)

module.exports = router
