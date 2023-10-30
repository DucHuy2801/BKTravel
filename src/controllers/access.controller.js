'use strict'

const AccessService = require("../services/access.service")
const {OK, CREATED, SuccessResponse} = require("../core/success.response")

class AccessController {
    register = async (req, res, next) => {
        new CREATED({
            message: "Register successfully",
            metadata: await AccessService.register(req.body),
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
          message: 'Logout success!',
          metadata: await AccessService.logout({keyStore: req.keyStore})
        }).send(res)
    }
}

module.exports = new AccessController()