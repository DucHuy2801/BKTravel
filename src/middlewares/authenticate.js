'use strict'

const jwt = require('jsonwebtoken')

const HEADER = {
    AUTHORIZATION: 'authorization' 
}

const authenticate = (req, res, next) => {
    try {
        const token = req.headers[HEADER.AUTHORIZATION]
        if (!token || token === null || token === 'undefined')
            return res.status(400).json({ status: 'Unauthorized', message: "You don't have access"})

        const decodeUser = jwt.decode(token)
        req.user = decodeUser
        return next()
    } catch (error) {
        return res.status(500).json({ status: 'Fail', message: error.message })
    }
}

module.exports = {
    authenticate
}