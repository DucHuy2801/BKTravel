'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const tourController = require("../../controllers/tour.controller")
const formidableMiddleware = require('express-formidable');

router.use(formidableMiddleware());
router.post("/", asyncHandler(tourController.createTour))
router.get("/all", asyncHandler(tourController.getAllTours))
router.get("/all/waiting", asyncHandler(tourController.getWaitingTours))
router.get("/all/deleted", asyncHandler(tourController.getDeletedTours))
router.get("/all/online", asyncHandler(tourController.getOnlineTours))
router.get("/search", tourController.searchTour)
router.get("/:tour_id", asyncHandler(tourController.getTour))
router.put("/:tour_id", asyncHandler(tourController.updateTour))
router.put("/recover/:tour_id", asyncHandler(tourController.recoverTour))
router.put("/upload/:tour_id", asyncHandler(tourController.updateCoverImageTour))
router.delete("/:tour_id", asyncHandler(tourController.deleteTour))

module.exports = router