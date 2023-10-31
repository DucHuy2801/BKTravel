'use strict'

const keyTokenModel = require("../models/keyToken.model");
const { DataTypes } = require("sequelize");
const Token = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ user_id, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: user_id }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { returning: true }

            const token = await Token.findOne({ where: filter});
            
            if (token) {
                const updateToken = await token.update(update, options);
                return updateToken.publicKey;
            } else {
                return null;
            }
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await Token.findOne({ where: {user_id: userId}});
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await Token.findOne({ where: {refreshTokenUsed: refreshToken}});
    }

    static findByRefreshToken = async (refreshToken) => {
        return await Token.findOne({ where: {refreshToken: refreshToken}});
    }

    static removeKeyById = async (id) => {
       return await Token.destroy({where: {id}});
    }
    
    static deleteKeyById = async (userId) => {
        return await Token.destroy({where: {user_id: userId}});
    }
}

module.exports = KeyTokenService;