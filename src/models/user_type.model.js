'use strict'
const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")

const UserType = sequelize.define('user_type', {
    user_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    name_level: {
        type: DataTypes.ENUM('Copper', 'Silver', 'Gold'),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = UserType