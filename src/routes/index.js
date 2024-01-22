'use strict'

const express = require('express')
const router = express.Router()

router.use('/api/v1/auth', require("./auth"))
router.use('/api/v1/user', require("./user"))

module.exports = router