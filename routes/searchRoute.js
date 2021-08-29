const router = require('express').Router()

const { searchRedultGetController }  = require('../controllers/searchController')

router.get('/',searchRedultGetController)

module.exports = router