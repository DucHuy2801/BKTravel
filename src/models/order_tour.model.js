'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const User = require("./user.model")
const Tour = require("./tour.model")

const OrderTour = sequelize.define("user_order", {
    order_tour_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tour,
            key: 'tour_id'
        }
    }
})  

User.belongsToMany(Tour, { through: OrderTour })
Tour.belongsToMany(User, { through: OrderTour })

module.exports = OrderTour