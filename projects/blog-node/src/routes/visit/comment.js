const router = require('koa-router')()
const controller = require('../../controller/commentController/index')

router.prefix('/comment')

router.post('/commit', controller.commit)
router.post('/manageList', controller.manageList)
router.post('/audit', controller.audit)
router.post('/like', controller.like)
router.post('/list', controller.list)
router.post('/delete', controller.delete)
router.post('/replyList', controller.replyList)

module.exports = router
