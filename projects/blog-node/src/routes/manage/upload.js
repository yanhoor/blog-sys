const router = require('koa-router')()
const controller = require('../../controller/uploadController')

router.post('/upload', controller.upload)

module.exports = router
