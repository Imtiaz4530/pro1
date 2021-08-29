const router = require('express').Router()
const {getUpload , postUpload,uploadProfilePic, removeProfilePics , postImageController} = require('../controllers/uploadController')
const uploadMiddlewire = require('../custom middlewire/uploadMiddlewire')
const {isAuthenticated}  = require('../custom middlewire/authMiddleWire')

router.get('/play', getUpload)
router.post('/play',uploadMiddlewire.single('avatar'), postUpload)

router.post('/propic',isAuthenticated,uploadMiddlewire.single('profilePics'),uploadProfilePic)

router.delete('/propic',isAuthenticated,removeProfilePics)

router.post('/postImage', isAuthenticated, uploadMiddlewire.single('post-image'),postImageController)

module.exports = router