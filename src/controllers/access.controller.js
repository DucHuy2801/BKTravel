'use strict'

const AccessService = require("../services/access.service")
const {OK, CREATED, SuccessResponse} = require("../core/success.response")

class AccessController {
    register = async (req, res, next) => {
        new CREATED({
            message: "Regiter successfully",
            metadata: await AccessService.register(req.body),
        }).send(res)
    }
}

module.exports = new AccessController()