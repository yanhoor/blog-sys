const router = require('koa-router')()
const controller = require('../../controller/userController')

router.prefix('/user')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.get('/info', controller.info)

module.exports = router
