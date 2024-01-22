'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const typeVoucher = {
    PERCENT: 'percent',
    FIXED: 'fixed'
}

const Voucher = sequelize.define("voucher", {
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(typeVoucher.PERCENT, typeVoucher.FIXED),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expired_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Voucher