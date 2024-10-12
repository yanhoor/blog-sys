const Router = require('@koa/router')
const router = new Router()
const controller = require('../../controller/notificationController')

router.prefix('/notification')

router.post('/list', controller.list)
router.post('/count', controller.count)
router.post('/info', controller.info)
router.post('/read', controller.read)

module.exports = router
