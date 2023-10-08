const router = require('koa-router')()
const controller = require('../../controller/fileController')

router.prefix('/file')

router.post('/upload', controller.upload)
router.post('/mergeMultiPart', controller.mergeMultiPart)
router.post('/checkFile', controller.checkFile)

module.exports = router
