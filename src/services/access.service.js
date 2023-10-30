'use strict'
const User = require("../models/user.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { BadRequestError } = require("../core/error.response")
const { getInfoData } = require("../utils")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")

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
        if (password.length < 6) {
            throw new BadRequestError('Error: Password is weak')
        }

        const hassedpassword = await bcrypt.hash(password, 10)

        const newUser = new User({username, password: hassedpassword, gmail});

        const savedUser = await newUser.save().catch((error) => {
            console.log("Error: ", error)
            throw new BadRequestError('Error: Cannot register user at the moment')
        })
        if (savedUser) {
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const keyStore = await KeyTokenService.createKeyToken({
                user_id: savedUser.user_id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                return {
                    code: '500',
                    message: 'keyStore errors'
                }
            }

            const tokens = await createTokenPair({user_id: savedUser.user_id, username}, publicKey, privateKey)
            console.log(`Creating token successfully::`, tokens)
            return {
                code: 201,
                metadata: {
                    user: getInfoData({fields: ['user_id', 'username'], object: savedUser})
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService