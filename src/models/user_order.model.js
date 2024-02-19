'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const User = require("../models/user.model")
const Tour = require("../models/tour.model")

const UserOrder = sequelize.define("user_order", {
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

User.belongsToMany(Tour, { through: UserOrder })
Tour.belongsToMany(User, { through: UserOrder })

module.exports = UserOrder