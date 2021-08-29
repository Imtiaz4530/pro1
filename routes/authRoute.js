const router = require('express').Router()
const singupValidatorEx = require('../validator/auth/singupValidator')
const loginValidatorEx = require('../validator/auth/loginValidator')
const {isUnAuthenticated} = require('../custom middlewire/authMiddleWire')
const {isAuthenticated}  = require('../custom middlewire/authMiddleWire')

const {singupGetController,
    singupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController} = require('../controllers/authController')

router.get('/singup',isUnAuthenticated(),singupGetController)
router.post('/singup',isUnAuthenticated(),singupValidatorEx,singupPostController)

router.get('/login',isUnAuthenticated(),loginGetController)
router.post('/login',isUnAuthenticated(),loginValidatorEx,loginPostController)

router.get('/logout',logoutController)

router.get('/change-password',isAuthenticated, changePasswordGetController)
router.post('/change-password',isAuthenticated, changePasswordPostController)

module.exports = router