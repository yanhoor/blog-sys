const router = require('koa-router')()
const controller = require('../../controller/topicController/index')

router.prefix('/topic')

router.post('/list', controller.list)

module.exports = router
