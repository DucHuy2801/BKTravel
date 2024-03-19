'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

class Cart extends Model {}
Cart.init({
    cart_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, { sequelize, modelName: "cart"})

module.exports = Cart