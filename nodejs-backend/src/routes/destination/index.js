'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const destinationController = require("../../controllers/destination.controller")

router.get("/all", asyncHandler(destinationController.getAllDestinations))

module.exports = router