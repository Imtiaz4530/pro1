const router = require('express').Router()
const {isAuthenticated}  = require('../custom middlewire/authMiddleWire')
const profileValidator = require('../validator/dashboard/profileValidator')

const {dashBoardGetController,
    createProfileGetController,
    createProfilePostController,
    editProfilegetController,
    editProfilePostController,
    bookmarkgetController,
    commentgetController} = require('../controllers/dashboardController')


router.get('/',isAuthenticated, dashBoardGetController)
router.get('/createProfile',isAuthenticated,createProfileGetController)
router.post('/createProfile',isAuthenticated,profileValidator,createProfilePostController)
router.get('/editProfile',isAuthenticated,editProfilegetController)
router.post('/editProfile',isAuthenticated,profileValidator,editProfilePostController)

router.get('/bookmark',isAuthenticated, bookmarkgetController )
router.get('/comments',isAuthenticated, commentgetController )

module.exports = router