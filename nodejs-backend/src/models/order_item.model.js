'use strict'

const { DataTypes, Model } = require("sequelize")
const sequelize = require("../database/index")

class OrderItem extends Model {}
OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { sequelize, modelName: "order_item" })

module.exports = OrderItem