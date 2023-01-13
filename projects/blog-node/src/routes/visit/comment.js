const router = require('koa-router')()
const controller = require('../../controller/commentController')

router.prefix('/comment')

router.post('/commit', controller.commit)
router.post('/list', controller.list)
router.post('/replyList', controller.replyList)

module.exports = router
