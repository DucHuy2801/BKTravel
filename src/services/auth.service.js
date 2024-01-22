'use strict'
const OAuth2Account = require("../models/admin.model")


const loginSuccessService = (account_id) => new Promise(async(resolve, reject) => {
    try {
        const respones = await OAuth2Account.findOne({
            where: {account_id}
        })
        console.log(respones)
        resolve(respones)
    } catch (error) {
        reject({
            message: 'Fail at auth server' + error
        })
    }
})

module.exports = {
    loginSuccessService
}