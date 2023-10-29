''
const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../auth/checkAuth')
const accessController = require("../controllers/access.controller")

// UserRegister
router.post('/api/register', asyncHandler(accessController.register))

module.exports = router