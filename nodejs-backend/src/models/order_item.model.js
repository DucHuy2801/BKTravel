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
    adult_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    child_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { sequelize, modelName: "order_item" })

module.exports = OrderItem