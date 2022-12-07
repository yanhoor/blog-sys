const router = require('koa-router')()
const controller = require('../../controller/notificationController')

router.prefix('/notification')

router.post('/list', controller.list)

module.exports = router
