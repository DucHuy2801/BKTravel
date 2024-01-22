const  { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const statusOrder = {
    CANCEL: 'Đã hủy',
    NOT_PAYMENT: 'Chưa thanh toán',
    PAYMENT: 'Đã thanh toán'
}

const Order = sequelize.define("order", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
})

module.exports = Order