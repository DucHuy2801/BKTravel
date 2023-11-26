'use strict'
const User = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { getInfoData } = require("../utils")
const KeyTokenService = require("./keyToken.service")
const { findUserByGmail } = require("./user.service")

class AccessService {
    static register = async ({firstname, lastname, gmail, password, confirm_password}) => {
        const alreadyExistUser = await User.findOne({ where: {gmail} }).catch(
            (err) => {
                console.log("Error: ", err)
            }
        )
        if (alreadyExistUser) {
            throw new BadRequestError('Error: Gmail already exists');
        }
        if (password.length < 6) {
            throw new BadRequestError('Error: Password is weak')
        }
        if (password !== confirm_password) {
            throw new BadRequestError("Password doesn't match")
        }
        const hassedpassword = await bcrypt.hash(password, 10)

        const newUser = new User({firstname, lastname, gmail, password: hassedpassword, role_user: 'customer'});

        const savedUser = await newUser.save().catch((error) => {
            console.log("Error: ", error)
            throw new BadRequestError('Error: Cannot register user at the moment')
        })
        if (savedUser) {
            return {
                code: 201,
                metadata: {
                    user: getInfoData({fields: ['firstname', 'lastname', 'gmail'], object: savedUser})
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }

    static login = async ({gmail, password, refreshToken = null}) => {
        const foundUser = await findUserByGmail(gmail) 
        if (!foundUser) {
            throw new BadRequestError("Username doesn't exist!")
        }

        const match = bcrypt.compare(password, foundUser.password)
        if (!match) throw new AuthFailureError('Authentication error!')

       const jwtToken = jwt.sign(
            {use_id: foundUser.use_id, gmail: foundUser.gmail, role_user: foundUser.role_user},
            process.env.JWT_SECRET
       )
       return {
            code : 200,
            token: jwtToken
       }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.deleteKeyById(keyStore.user_id)
        return delKey
    }
}

module.exports = AccessService