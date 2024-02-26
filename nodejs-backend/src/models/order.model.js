const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index");
const { StatusOrder } = require("../common/status");

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
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(StatusOrder.CANCEL, StatusOrder.NOT_PAYMENT, StatusOrder.PAYMENT),
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, { sequelize, modelName: 'order' }
);

module.exports = Order;
