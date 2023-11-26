'use strict'

const User = require('../models/user.model')

const findUserByGmail = async (gmail) => {
    return await User.findOne({where: {gmail}})
}

module.exports = {
    findUserByGmail
}