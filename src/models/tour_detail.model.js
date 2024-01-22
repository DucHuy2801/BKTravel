'use strict'

const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
const Tour = require("./tour.model")

const TourDetail = sequelize.define("tour_detail", {
    tour_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description_place: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    current_customers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max_customer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    departure_place: {
        type: DataTypes.STRING,
        allowNull: true
    },
    departure_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    highlight: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

TourDetail.belongsTo(Tour)

module.exports = TourDetail