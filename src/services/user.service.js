'use strict'

const User = require('../models/user.model')

const findUserByUsername = async (username) => {
    return await User.findOne({where: {username}})
}

module.exports = {
    findUserByUsername
}