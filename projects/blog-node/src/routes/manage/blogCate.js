const router = require('koa-router')()
const controller = require('../../controller/blogCateController')

router.prefix('/blogCate')

router.post('/edit', controller.edit)
router.post('/list', controller.list)
router.post('/delete', controller.delete)
router.post('/info', controller.info)
router.post('/all', controller.all)

module.exports = router
