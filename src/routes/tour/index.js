'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourController = require("../../controllers/tour.controller")

router.post("/", asyncHandler(tourController.createTour))
router.get("/all", asyncHandler(tourController.getAllTours))
router.get("/:tour_detail_id", asyncHandler(tourController.getTour))

module.exports = router