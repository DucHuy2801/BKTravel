'use strict'

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index");
const { StatusOrder } = require("../common/status");
const OrderItem = require("./order_item.model");

class Order extends Model {}

Order.init(
    {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(StatusOrder.CANCEL, StatusOrder.NOT_PAYMENT, StatusOrder.PAYMENT),
            allowNull: true
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, { sequelize, modelName: 'order' }
);

Order.hasMany(OrderItem, { foreignKey: "order_id" })
module.exports = Order;
