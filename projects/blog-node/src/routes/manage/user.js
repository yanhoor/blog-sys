const router = require('koa-router')()
const controller = require('../../controller/userController')

router.prefix('/user')

router.post('/register', controller.register)
router.post('/login', controller.adminLogin)
router.post('/logout', controller.logout)
router.post('/all', controller.all)
router.post('/updateAvatar', controller.updateAvatar)
router.get('/info', controller.info)

module.exports = router
