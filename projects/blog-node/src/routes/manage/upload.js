const Router = require('@koa/router')
const router = new Router()
const controller = require('../../controller/fileController')

router.prefix('/file')

router.post('/upload', controller.upload)
router.post('/mergeMultiPart', controller.mergeMultiPart)
router.post('/checkFile', controller.checkFile)
router.post('/insertUrl', controller.insertUrl)

module.exports = router
