const router = require('koa-router')()
const controller = require('../../controller/followGroupController/index')

router.prefix('/followGroup')

router.post('/edit', controller.edit)
router.post('/list', controller.list)
router.post('/delete', controller.delete)
router.post('/info', controller.info)
router.post('/all', controller.all)
router.post('/sort', controller.sort)
router.post('/containList', controller.containList)

module.exports = router
