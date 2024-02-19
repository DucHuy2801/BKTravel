'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourController = require("../../controllers/tour.controller")
const formidableMiddleware = require('express-formidable');

router.use(formidableMiddleware());
router.post("/", asyncHandler(tourController.createTour))
router.get("/all", asyncHandler(tourController.getAllTours))
// router.get("/search", tourController.searchTour)
router.get("/:tour_id", asyncHandler(tourController.getTour))
router.patch("/:tour_id", asyncHandler(tourController.updateTour))
router.delete("/:tour_id", asyncHandler(tourController.deleteTour))

module.exports = router