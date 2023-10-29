'use strict'
const User = require("../models/user.model")
const { BadRequestError } = require("../core/error.response")
const { getInfoData } = require("../utils")

class AccessService {
    static register = async ({username, password, gmail}) => {
        const alreadyExistUser = await User.findOne({ where: {username} }).catch(
            (err) => {
                console.log("Error: ", err)
            }
        )

        if (alreadyExistUser) {
            throw new BadRequestError('Error: Username already exists');
        }
        const newUser = new User({username, password, gmail});
        console.log(`newuser`, newUser)
        const savedUser = await newUser.save().catch((error) => {
            console.log("Error: ", error)
            throw new BadRequestError('Error: Cannot register user at the moment')
        })

        if (savedUser) return {
            code: 201,
            metadata: {
                user: getInfoData({fields: ['user_id', 'fullname'], object: newUser})
            }
        }
    }
}

module.exports = AccessService