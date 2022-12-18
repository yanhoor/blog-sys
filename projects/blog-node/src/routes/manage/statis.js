const router = require('koa-router')()
const controller = require('../../controller/statisController')

router.prefix('/statis')

router.post('/weekDetail', controller.weekDetail)
router.post('/totalCount', controller.totalCount)
router.post('/user', controller.user)

module.exports = router
