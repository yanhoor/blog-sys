const router = require('koa-router')()
const controller = require('../../controller/mediaController/index')

router.prefix('/media')

router.post('/info', controller.info)

module.exports = router
