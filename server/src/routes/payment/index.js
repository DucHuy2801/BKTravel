'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const paymentController = require('../../controllers/payment.controller')

router.post("/", asyncHandler(paymentController.createPaymentUrl))

module.exports = router