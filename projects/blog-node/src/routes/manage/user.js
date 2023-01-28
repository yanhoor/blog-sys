const router = require('koa-router')()
const controller = require('../../controller/userController')

router.prefix('/user')

router.post('/register', controller.register)
router.post('/adminLogin', controller.adminLogin)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.post('/all', controller.all)
router.post('/list', controller.list)
router.post('/lock', controller.operateLock)
router.post('/unlock', controller.operateLock)
router.post('/updateAvatar', controller.updateAvatar)
router.get('/info', controller.info)
router.post('/update', controller.update)
router.post('/follow', controller.operateFollow)
router.post('/setGroup', controller.setGroup)
router.post('/:id', controller.userInfo)

module.exports = router
