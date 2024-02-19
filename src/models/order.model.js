const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/index");

const statusOrder = {
    CANCEL: 'Hủy',
    NOT_PAYMENT: 'Chưa thanh toán',
    PAYMENT: 'Đã thanh toán'
}

class Order extends Model {}

Order.init(
    {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tour_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(statusOrder.CANCEL, statusOrder.NOT_PAYMENT, statusOrder.PAYMENT),
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, { sequelize, modelName: 'order' }
);



module.exports = Order;
