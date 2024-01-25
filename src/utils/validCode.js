'use strict'

const moment = require("moment")

const isValidCode = async (expire_time) => {
    const now = moment()
    const expireTime = moment(expire_time)
    return now.isBefore(expireTime)
}

module.exports = {
    isValidCode
}