const router = require('koa-router')()
const controller = require('../../controller/blogController')

router.prefix('/blog')

router.post('/list', controller.list)
router.post('/edit', controller.edit)
router.post('/delete', controller.delete)
router.post('/info', controller.info)
router.post('/operate', controller.operate)

module.exports = router
