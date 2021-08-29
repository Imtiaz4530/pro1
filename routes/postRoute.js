const router = require('express').Router()
const {isAuthenticated}  = require('../custom middlewire/authMiddleWire')
const {createPostGetController, createPostPostController, editPostGetController,editPostPostController, deletePostController, getAllPosts} = require('../controllers/postControlle')
const postvalidator = require('../validator/dashboard/post/postvalidator')
const multer = require('../custom middlewire/uploadMiddlewire')

router.get('/create',isAuthenticated,createPostGetController)
router.post('/create',isAuthenticated,multer.single('post-thumbnail'),postvalidator,createPostPostController)
router.get('/edit/:postId'  ,isAuthenticated,editPostGetController)
router.post('/edit/:postId',isAuthenticated,multer.single('post-thumbnail'),postvalidator,editPostPostController)
router.get('/delete/:postId',isAuthenticated,deletePostController)

router.get('/',isAuthenticated,getAllPosts)

module.exports = router