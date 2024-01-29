'use strict'

const express = require('express')
const router = express.Router()

router.use('/api/v1/auth', require("./auth"))
router.use('/api/v1/user', require("./user"))
router.use('/api/v1/tour', require("./tour"))
router.use('/api/v1/voucher', require("./voucher"))

module.exports = router