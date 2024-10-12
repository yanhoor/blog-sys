const Router = require('@koa/router')
const router = new Router()
const controller = require('../../controller/topicController/index')

router.prefix('/topic')

router.post('/list', controller.list)
router.post('/manageList', controller.manageList)

module.exports = router
