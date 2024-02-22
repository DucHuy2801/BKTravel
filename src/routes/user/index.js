'use strict'

const express = require("express")
const { asyncHandler } = require("../../auth/checkAuth")
const router = express.Router()
const userController = require("../../controllers/user.controller")
const { authenticate } = require("../../middlewares/authenticate")
const upload = require("../../config/cloudinary.config")

router.get("/:user_id", authenticate, asyncHandler(userController.getInfoUser))
router.put("/change-password", authenticate, asyncHandler(userController.changePassword))
router.get("/:user_id/wishlist")
router.put("/update/:user_id", authenticate, asyncHandler(userController.updateInfoUser))
router.put("/upload/:user_id", authenticate, upload.single("avatar"), asyncHandler(userController.uploadAvatar))
router.put("/forgot-password", asyncHandler(userController.forgotPassword))
router.put("/reset-password", asyncHandler(userController.resetPassword))

module.exports = router