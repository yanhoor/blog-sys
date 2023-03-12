const router = require('koa-router')()
const controller = require('../../controller/blogController/index')

router.prefix('/blog')

router.post('/manageList', controller.manageList)
router.post('/list', controller.list)
router.post('/edit', controller.edit)
router.post('/delete', controller.delete)
router.post('/info', controller.info)
router.post('/manageInfo', controller.manageInfo)
router.post('/like', controller.like)
router.post('/actionUserList/:type', controller.actionUserList)
router.post('/collect', controller.collect)
router.post('/audit', controller.audit)

module.exports = router
