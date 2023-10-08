const router = require('koa-router')()
const controller = require('../../controller/uploadController')

router.post('/upload', controller.upload)
router.post('/mergeMultiPart', controller.mergeMultiPart)
router.post('/checkFile', controller.checkFile)

module.exports = router
