'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const cartController = require('../../controllers/cart.controller')

router.post("/", asyncHandler(cartController.addTourToCart))
router.get("/:user_id", asyncHandler(cartController.getCartByUser))
router.put("/increment", asyncHandler(cartController.incrementQuantityOrderItem))
router.put("/decrement", asyncHandler(cartController.decrementQuantityOrderItem))
router.delete("/:user_id", asyncHandler(cartController.deleteOrderItem))

module.exports = router