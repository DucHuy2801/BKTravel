'use strict'

const { DataTypes } = require("sequelize")
const sequelize = require("../database/index")
const Tour = require("./tour.model")

const Location = sequelize.define("location", {
    location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: null
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: null
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: null
    }

})

module.exports = Location