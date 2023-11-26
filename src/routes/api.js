''
const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../auth/checkAuth')
const accessController = require("../controllers/access.controller")

router.post('/api/tour/register', asyncHandler(accessController.register))
router.post('/api/tour/login', asyncHandler(accessController.login))
router.post('/api/tour/logout', asyncHandler(accessController.logout))

module.exports = router