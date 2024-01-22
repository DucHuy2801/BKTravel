'use strict'

const express = require("express")
const { asyncHandler } = require("../../auth/checkAuth")
const router = express.Router()
const userController = require("../../controllers/user.controller")
const { authenticate } = require("../../middlewares/authenticate")
const upload = require("../../config/cloudinary.config")

router.get("/:user_id", authenticate, asyncHandler(userController.getInfoUser))
router.post("/update/:user_id", authenticate, asyncHandler(userController.updateInfoUser))
router.post("/upload/:user_id", authenticate, upload.single("avatar"), asyncHandler(userController.uploadAvatar))

module.exports = router